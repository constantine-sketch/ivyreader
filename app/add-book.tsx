import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function AddBookScreen() {
  const colors = useColors();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [category, setCategory] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Search books with automatic query when user types
  const { data: searchResults, isLoading: isSearching } = trpc.books.search.useQuery(
    { query: searchQuery, maxResults: 10 },
    { enabled: searchQuery.length >= 2 }
  );

  const createBook = trpc.books.create.useMutation();
  const utils = trpc.useUtils();

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowResults(text.length >= 2);
  };

  const handleSelectBook = (book: any) => {
    setTitle(book.title);
    setAuthor(book.author);
    setTotalPages(book.pageCount?.toString() || "");
    setCategory(book.category || "");
    setCoverUrl(book.coverUrl || "");
    setSearchQuery("");
    setShowResults(false);
    Keyboard.dismiss();
  };

  const handleCreate = async () => {
    if (!title || !author) {
      alert("Please provide at least a title and author");
      return;
    }

    try {
      setIsCreating(true);
      await createBook.mutateAsync({
        title,
        author,
        totalPages: parseInt(totalPages) || 100,
        category: category || "Uncategorized",
        coverUrl: coverUrl || undefined,
        status: "queue",
      });

      // Invalidate cache to trigger refresh
      await utils.books.list.invalidate();

      alert(`"${title}" added to your library!`);
      router.back();
    } catch (error) {
      console.error("Failed to create book:", error);
      alert("Failed to add book. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-6">
              <Pressable
                onPress={() => router.back()}
                className="mb-4"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-sm" style={{ color: colors.primary }}>← Back</Text>
              </Pressable>
              
              <Text className="text-3xl font-bold text-foreground mb-2">Add a Book</Text>
              <Text className="text-base text-muted">
                Search our database or add manually
              </Text>
            </View>

            {/* Search Section */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Search Books
              </Text>
              <View className="relative">
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search our database"
                  placeholderTextColor={colors.muted}
                  returnKeyType="search"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
                
                {/* Search Results Dropdown */}
                {showResults && (
                  <View
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      maxHeight: 300,
                      zIndex: 1000,
                    }}
                  >
                    {isSearching ? (
                      <View className="p-4 items-center">
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text className="text-sm text-muted mt-2">Searching...</Text>
                      </View>
                    ) : searchResults && searchResults.length > 0 ? (
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {searchResults.map((book, index) => (
                          <Pressable
                            key={index}
                            onPress={() => handleSelectBook(book)}
                            className="p-3 flex-row items-center"
                            style={({ pressed }) => ({
                              backgroundColor: pressed ? colors.border : 'transparent',
                              borderBottomWidth: index < searchResults.length - 1 ? 1 : 0,
                              borderBottomColor: colors.border,
                            })}
                          >
                            {book.coverUrl ? (
                              <Image
                                source={{ uri: book.coverUrl }}
                                style={{
                                  width: 40,
                                  height: 60,
                                  borderRadius: 4,
                                  marginRight: 12,
                                  backgroundColor: colors.border,
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                style={{
                                  width: 40,
                                  height: 60,
                                  borderRadius: 4,
                                  marginRight: 12,
                                  backgroundColor: colors.border,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text style={{ fontSize: 20 }}>📚</Text>
                              </View>
                            )}
                            <View className="flex-1">
                              <Text className="text-sm font-bold text-foreground" numberOfLines={2}>
                                {book.title}
                              </Text>
                              <Text className="text-xs text-muted" numberOfLines={1}>
                                {book.author}
                              </Text>
                              {book.pageCount && (
                                <Text className="text-xs text-muted">
                                  {book.pageCount} pages
                                </Text>
                              )}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    ) : (
                      <View className="p-4">
                        <Text className="text-sm text-muted text-center">
                          No results found. Try a different search or add manually below.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
              <Text className="text-xs text-muted mx-4">OR ADD MANUALLY</Text>
              <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            </View>

            {/* Manual Entry Form */}
            <View className="gap-4">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Title *
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter book title"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Author *
                </Text>
                <TextInput
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Enter author name"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Total Pages
                </Text>
                <TextInput
                  value={totalPages}
                  onChangeText={setTotalPages}
                  placeholder="Enter total pages"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Category
                </Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g., Fiction, Business, Self-Help"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Cover URL (Optional)
                </Text>
                <TextInput
                  value={coverUrl}
                  onChangeText={setCoverUrl}
                  placeholder="Enter image URL"
                  placeholderTextColor={colors.muted}
                  returnKeyType="done"
                  autoCapitalize="none"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-8">
              <Pressable
                onPress={() => router.back()}
                className="flex-1 py-4 rounded-lg items-center"
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-sm font-bold text-foreground">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCreate}
                disabled={isCreating || !title || !author}
                className="flex-1 py-4 rounded-lg items-center"
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || isCreating || !title || !author ? 0.7 : 1,
                  },
                ]}
              >
                {isCreating ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text
                    className="text-sm font-bold"
                    style={{ color: colors.background }}
                  >
                    Add to Library
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
