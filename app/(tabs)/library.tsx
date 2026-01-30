import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { mockCurrentBook, mockQueueBooks } from "@/lib/mock-data";
import type { Book } from "@/lib/types";

type TabType = 'reading' | 'queue' | 'archive';

export default function LibraryScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>('reading');
  const [searchQuery, setSearchQuery] = useState('');

  const currentlyReading: Book[] = [mockCurrentBook];
  const queueBooks: Book[] = mockQueueBooks;
  const archiveBooks: Book[] = [];

  const renderBookCard = (book: Book) => {
    const progressPercentage = book.totalPages > 0 
      ? Math.round((book.currentPage / book.totalPages) * 100) 
      : 0;

    return (
      <TouchableOpacity 
        key={book.id}
        className="bg-surface rounded-2xl p-4 border border-border mb-3"
      >
        <View className="flex-row">
          {/* Book Cover Placeholder */}
          <View className="w-20 h-30 bg-border rounded-lg mr-4" />
          
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
                <Text className="text-xs text-success mb-1">{progressPercentage}% Complete</Text>
                <View className="h-1.5 bg-border rounded-full overflow-hidden">
                  <View 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${progressPercentage}%`,
                      backgroundColor: colors.primary 
                    }} 
                  />
                </View>
              </View>
            )}
            
            {book.status === 'queue' && (
              <Text className="text-xs text-muted">
                {book.totalPages} pages
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-foreground">My Library</Text>
              <Text className="text-xs text-muted mt-1">
                {currentlyReading.length + queueBooks.length + archiveBooks.length} VOLUMES COLLECTED
              </Text>
            </View>
            <TouchableOpacity 
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold text-sm" style={{ color: colors.background }}>
                Add Book
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View 
            className="flex-row items-center px-4 py-3 rounded-lg border border-border"
            style={{ backgroundColor: colors.surface }}
          >
            <TextInput
              placeholder="Search collection..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {/* Tabs */}
        <View className="px-6 mb-4">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setActiveTab('reading')}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'reading' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: activeTab === 'reading' ? colors.background : colors.foreground }}
              >
                Currently Reading
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('queue')}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'queue' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: activeTab === 'queue' ? colors.background : colors.foreground }}
              >
                Queue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('archive')}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'archive' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: activeTab === 'archive' ? colors.background : colors.foreground }}
              >
                Archive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Book List */}
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 32 }}>
          {activeTab === 'reading' && currentlyReading.map(renderBookCard)}
          {activeTab === 'queue' && queueBooks.map(renderBookCard)}
          {activeTab === 'archive' && archiveBooks.length === 0 && (
            <View className="items-center justify-center py-12">
              <Text className="text-muted text-center">
                No completed books yet.{'\n'}Keep reading to fill your archive!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
