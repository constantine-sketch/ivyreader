import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Image, RefreshControl, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import type { Book } from "@/lib/types";

type TabType = 'reading' | 'queue' | 'archive';

export default function LibraryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('reading');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real books from database
  const { data: allBooks, isLoading, refetch } = trpc.books.list.useQuery();
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // Fetch demo books to show when user has no books
  const { data: demoBooks } = trpc.books.demo.useQuery(undefined, {
    enabled: !isLoading && (!allBooks || allBooks.length === 0)
  });
  const createBook = trpc.books.create.useMutation();
  
  // Use demo books if user has no books
  const booksToDisplay = (allBooks && allBooks.length > 0) ? allBooks : (demoBooks || []);
  
  const deleteBook = trpc.books.delete.useMutation();
  
  const handleDeleteBook = async (bookId: number, bookTitle: string) => {
    if (Platform.OS === 'web') {
      if (!confirm(`Delete "${bookTitle}"?`)) return;
    } else {
      // For mobile, we'll use Alert
      const { Alert } = await import('react-native');
      await new Promise<void>((resolve, reject) => {
        Alert.alert(
          'Delete Book',
          `Are you sure you want to delete "${bookTitle}"?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => reject() },
            { text: 'Delete', style: 'destructive', onPress: () => resolve() },
          ]
        );
      }).catch(() => { throw new Error('Cancelled'); });
    }
    
    try {
      await deleteBook.mutateAsync({ id: bookId });
      await refetch();
    } catch (error: any) {
      if (error.message !== 'Cancelled') {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  // Filter books by status
  const currentlyReading = booksToDisplay?.filter(b => b.status === 'reading') || [];
  const queueBooks = booksToDisplay?.filter(b => b.status === 'queue') || [];
  const archiveBooks = booksToDisplay?.filter(b => b.status === 'completed') || [];

  const getActiveBooks = () => {
    switch (activeTab) {
      case 'reading':
        return currentlyReading;
      case 'queue':
        return queueBooks;
      case 'archive':
        return archiveBooks;
      default:
        return [];
    }
  };

  const filteredBooks = getActiveBooks().filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookCard = (book: any) => {
    const progressPercentage = book.totalPages > 0 
      ? Math.round((book.currentPage / book.totalPages) * 100) 
      : 0;

    return (
      <View 
        key={book.id}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 12,
          position: 'relative',
        }}
      >
        {/* Delete Button */}
        <Pressable
          onPress={() => handleDeleteBook(book.id, book.title)}
          className="absolute bottom-2 right-2 z-10 px-1"
          style={({ pressed }) => [{
            opacity: pressed ? 0.5 : 1,
          }]}
        >
          <Text className="text-xs text-muted">×</Text>
        </Pressable>

        <Pressable 
          onPress={() => console.log('Book pressed:', book.title)}
          className="flex-1"
        >
        <View className="flex-row">
          {/* Book Cover */}
          {book.coverUrl ? (
            <Image 
              source={{ uri: book.coverUrl }}
              className="w-20 h-30 rounded-lg mr-4"
              style={{ backgroundColor: colors.border }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-30 rounded-lg mr-4 items-center justify-center" style={{ backgroundColor: colors.border }}>
              <Text className="text-4xl">📚</Text>
            </View>
          )}
          
          <View className="flex-1">
            <View className="px-2 py-1 rounded mb-2 self-start" style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                {book.category.toUpperCase()}
              </Text>
            </View>
            
            <Text className="text-base font-bold text-foreground mb-1" numberOfLines={2}>
              {book.title}
            </Text>
            <Text className="text-sm text-muted mb-2">{book.author}</Text>
            
            {book.status === 'reading' && (
              <View>
                <Text className="text-xs mb-1" style={{ color: colors.primary }}>
                  {progressPercentage}% Complete
                </Text>
                <View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                  <View 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: colors.primary,
                      width: `${progressPercentage}%`
                    }} 
                  />
                </View>
                <Text className="text-xs text-muted mt-1">
                  Page {book.currentPage} of {book.totalPages}
                </Text>
              </View>
            )}
            
            {book.status === 'completed' && book.rating && (
              <View className="flex-row items-center">
                <Text className="text-sm" style={{ color: colors.primary }}>
                  {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                </Text>
              </View>
            )}
            
            {book.status === 'queue' && (
              <Text className="text-xs text-muted">
                {book.totalPages} pages
              </Text>
            )}
          </View>
        </View>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-foreground">My Library</Text>
            <Pressable
              onPress={() => router.push("/add-book")}
              className="px-4 py-2 rounded-lg"
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-sm font-bold" style={{ color: colors.background }}>
                + Add Book
              </Text>
            </Pressable>
          </View>
          <Text className="text-sm text-muted">
            {allBooks?.length || 0} books total
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mb-4 px-4 py-3 rounded-xl flex-row items-center" style={{ backgroundColor: colors.surface }}>
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search books..."
            placeholderTextColor={colors.muted}
            className="flex-1 text-foreground"
            style={{ color: colors.foreground }}
          />
        </View>

        {/* Tabs */}
        <View className="flex-row mb-4 p-1 rounded-xl" style={{ backgroundColor: colors.surface }}>
          <Pressable
            onPress={() => setActiveTab('reading')}
            className="flex-1 py-2 rounded-lg items-center"
            style={{
              backgroundColor: activeTab === 'reading' ? colors.primary : 'transparent',
            }}
          >
            <Text 
              className="text-sm font-semibold"
              style={{ color: activeTab === 'reading' ? colors.background : colors.muted }}
            >
              Reading ({currentlyReading.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('queue')}
            className="flex-1 py-2 rounded-lg items-center"
            style={{
              backgroundColor: activeTab === 'queue' ? colors.primary : 'transparent',
            }}
          >
            <Text 
              className="text-sm font-semibold"
              style={{ color: activeTab === 'queue' ? colors.background : colors.muted }}
            >
              Queue ({queueBooks.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('archive')}
            className="flex-1 py-2 rounded-lg items-center"
            style={{
              backgroundColor: activeTab === 'archive' ? colors.primary : 'transparent',
            }}
          >
            <Text 
              className="text-sm font-semibold"
              style={{ color: activeTab === 'archive' ? colors.background : colors.muted }}
            >
              Archive ({archiveBooks.length})
            </Text>
          </Pressable>
        </View>

        {/* Books List */}
        <View className="pb-8">
          {filteredBooks.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-lg text-muted mb-2">
                {searchQuery ? 'No books found' : 'No books in this section'}
              </Text>
              <Text className="text-sm text-muted">
                {searchQuery ? 'Try a different search' : 'Add books to get started'}
              </Text>
            </View>
          ) : (
            filteredBooks.map(renderBookCard)
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
