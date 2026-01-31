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

interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  category: string;
  coverUrl?: string;
  description?: string;
}

export default function AddBookScreen() {
  const colors = useColors();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Manual entry fields
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");
  const [manualPages, setManualPages] = useState("");
  const [manualCategory, setManualCategory] = useState("");

  const createBook = trpc.books.create.useMutation();
  const utils = trpc.useUtils();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();
    setIsSearching(true);
    setSelectedBook(null);

    try {
      const results = await utils.books.search.fetch({ query: searchQuery });
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Failed to search books. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleAddBook = async () => {
    const bookData = selectedBook
      ? {
          title: selectedBook.title,
          author: selectedBook.author,
          totalPages: selectedBook.pageCount || 100,
          category: selectedBook.category || "Uncategorized",
          coverUrl: selectedBook.coverUrl,
          status: "queue" as const,
        }
      : {
          title: manualTitle,
          author: manualAuthor,
          totalPages: parseInt(manualPages) || 100,
          category: manualCategory || "Uncategorized",
          status: "queue" as const,
        };

    if (!bookData.title || !bookData.author) {
      alert("Please provide at least a title and author");
      return;
    }

    try {
      setIsCreating(true);
      await createBook.mutateAsync(bookData);
      router.back();
    } catch (error) {
      console.error("Failed to add book:", error);
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
                <Text className="text-3xl font-bold text-foreground mb-2">Add a Book</Text>
                <Text className="text-base text-muted">
                  Search by title, author, or ISBN
                </Text>
              </View>

              {/* Search Bar */}
              <View className="mb-4">
                <View className="flex-row gap-2">
                  <TextInput
                    placeholder="Search for a book..."
                    placeholderTextColor={colors.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    className="flex-1 p-4 rounded-lg text-foreground"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      color: colors.foreground,
                    }}
                  />
                  <Pressable
                    onPress={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.primary,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        justifyContent: "center",
                        opacity: pressed || isSearching || !searchQuery.trim() ? 0.7 : 1,
                      },
                    ]}
                  >
                    {isSearching ? (
                      <ActivityIndicator color={colors.background} size="small" />
                    ) : (
                      <Text className="text-sm font-bold" style={{ color: colors.background }}>
                        Search
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    Search Results
                  </Text>
                  {searchResults.map((book) => (
                    <Pressable
                      key={book.id}
                      onPress={() => handleSelectBook(book)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 12,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <View className="flex-row gap-3">
                        {book.coverUrl ? (
                          <Image
                            source={{ uri: book.coverUrl }}
                            style={{
                              width: 60,
                              height: 90,
                              borderRadius: 6,
                              backgroundColor: colors.border,
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={{
                              width: 60,
                              height: 90,
                              borderRadius: 6,
                              backgroundColor: colors.border,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-2xl">📚</Text>
                          </View>
                        )}
                        <View className="flex-1">
                          <Text className="text-base font-bold text-foreground mb-1">
                            {book.title}
                          </Text>
                          <Text className="text-sm text-muted mb-1">{book.author}</Text>
                          <View className="flex-row gap-2">
                            <Text className="text-xs text-muted">
                              {book.pageCount} pages
                            </Text>
                            <Text className="text-xs text-muted">•</Text>
                            <Text className="text-xs text-muted">{book.category}</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Selected Book Preview */}
              {selectedBook && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    Selected Book
                  </Text>
                  <View
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row gap-3 mb-3">
                      {selectedBook.coverUrl ? (
                        <Image
                          source={{ uri: selectedBook.coverUrl }}
                          style={{
                            width: 80,
                            height: 120,
                            borderRadius: 8,
                            backgroundColor: colors.border,
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: 80,
                            height: 120,
                            borderRadius: 8,
                            backgroundColor: colors.border,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text className="text-4xl">📚</Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground mb-1">
                          {selectedBook.title}
                        </Text>
                        <Text className="text-sm text-muted mb-2">
                          {selectedBook.author}
                        </Text>
                        <View className="flex-row gap-2">
                          <Text className="text-xs text-muted">
                            {selectedBook.pageCount} pages
                          </Text>
                          <Text className="text-xs text-muted">•</Text>
                          <Text className="text-xs text-muted">{selectedBook.category}</Text>
                        </View>
                      </View>
                    </View>
                    {selectedBook.description && (
                      <Text
                        className="text-xs text-muted"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {selectedBook.description}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Manual Entry Fallback */}
              {!selectedBook && searchResults.length === 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    Or Add Manually
                  </Text>
                  <View className="gap-3">
                    <TextInput
                      placeholder="Book Title"
                      placeholderTextColor={colors.muted}
                      value={manualTitle}
                      onChangeText={setManualTitle}
                      returnKeyType="next"
                      className="p-4 rounded-lg text-foreground"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        color: colors.foreground,
                      }}
                    />
                    <TextInput
                      placeholder="Author"
                      placeholderTextColor={colors.muted}
                      value={manualAuthor}
                      onChangeText={setManualAuthor}
                      returnKeyType="next"
                      className="p-4 rounded-lg text-foreground"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        color: colors.foreground,
                      }}
                    />
                    <TextInput
                      placeholder="Total Pages"
                      placeholderTextColor={colors.muted}
                      value={manualPages}
                      onChangeText={setManualPages}
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
                    <TextInput
                      placeholder="Category (e.g., Fiction, Business)"
                      placeholderTextColor={colors.muted}
                      value={manualCategory}
                      onChangeText={setManualCategory}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
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
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-auto">
                <Pressable
                  onPress={() => router.back()}
                  disabled={isCreating}
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
                  onPress={handleAddBook}
                  disabled={isCreating || (!selectedBook && !manualTitle)}
                  className="flex-1 py-4 rounded-lg items-center"
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary,
                      opacity:
                        pressed || isCreating || (!selectedBook && !manualTitle)
                          ? 0.7
                          : 1,
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
                      Add Book
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
