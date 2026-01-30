import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import {
  searchBooks,
  getBookCoverUrl,
  getPrimaryAuthor,
  getPrimaryCategory,
  type GoogleBook,
} from "@/lib/google-books";

interface AddBookModalProps {
  visible: boolean;
  onClose: () => void;
  onBookAdded: (book: {
    title: string;
    author: string;
    category: string;
    totalPages: number;
    coverUrl?: string;
    status: "reading" | "queue";
  }) => Promise<void>;
}

export function AddBookModal({ visible, onClose, onBookAdded }: AddBookModalProps) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"reading" | "queue">("queue");
  const [isAdding, setIsAdding] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchBooks(searchQuery, 10);
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddBook = async (book: GoogleBook) => {
    if (isAdding) return;

    setIsAdding(true);
    try {
      await onBookAdded({
        title: book.title,
        author: getPrimaryAuthor(book),
        category: getPrimaryCategory(book),
        totalPages: book.pageCount || 300, // Default to 300 if not available
        coverUrl: getBookCoverUrl(book),
        status: selectedStatus,
      });

      // Reset and close
      setSearchQuery("");
      setSearchResults([]);
      setSelectedStatus("queue");
      onClose();
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStatus("queue");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Pressable className="flex-1" onPress={handleClose} />
        
        <View
          className="h-5/6 rounded-t-3xl"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="p-6 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-foreground">Add Book</Text>
              <Pressable onPress={handleClose}>
                <Text className="text-base text-muted">Cancel</Text>
              </Pressable>
            </View>

            {/* Search Input */}
            <View className="relative">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by title, author, or ISBN..."
                placeholderTextColor={colors.muted}
                className="rounded-lg px-4 py-3 text-foreground"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                autoFocus
                returnKeyType="search"
              />
              {isSearching && (
                <View className="absolute right-4 top-3">
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
            </View>

            {/* Status Selection */}
            <View className="flex-row gap-2 mt-4">
              <Pressable
                onPress={() => setSelectedStatus("reading")}
                className="flex-1 py-2 rounded-lg items-center"
                style={{
                  backgroundColor:
                    selectedStatus === "reading" ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedStatus === "reading" ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{
                    color: selectedStatus === "reading" ? colors.background : colors.foreground,
                  }}
                >
                  Currently Reading
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedStatus("queue")}
                className="flex-1 py-2 rounded-lg items-center"
                style={{
                  backgroundColor: selectedStatus === "queue" ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedStatus === "queue" ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{
                    color: selectedStatus === "queue" ? colors.background : colors.foreground,
                  }}
                >
                  Add to Queue
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Search Results */}
          <ScrollView className="flex-1 px-6 py-4">
            {searchQuery.trim().length === 0 && (
              <View className="items-center justify-center py-12">
                <Text className="text-base text-muted text-center">
                  Search for books by title, author, or ISBN
                </Text>
              </View>
            )}

            {searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching && (
              <View className="items-center justify-center py-12">
                <Text className="text-base text-muted text-center">
                  No books found. Try a different search term.
                </Text>
              </View>
            )}

            {searchResults.map((book) => {
              const coverUrl = getBookCoverUrl(book);
              const author = getPrimaryAuthor(book);
              const category = getPrimaryCategory(book);

              return (
                <Pressable
                  key={book.id}
                  onPress={() => handleAddBook(book)}
                  disabled={isAdding}
                  className="flex-row mb-4 p-3 rounded-xl"
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    opacity: pressed || isAdding ? 0.7 : 1,
                  })}
                >
                  {/* Book Cover */}
                  <View
                    className="w-16 h-24 rounded-lg mr-3 items-center justify-center"
                    style={{ backgroundColor: colors.border }}
                  >
                    {coverUrl ? (
                      <Image
                        source={{ uri: coverUrl }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-xs text-muted text-center px-1">No Cover</Text>
                    )}
                  </View>

                  {/* Book Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground mb-1" numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text className="text-xs text-muted mb-1">{author}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs" style={{ color: colors.primary }}>
                        {category}
                      </Text>
                      {book.pageCount && (
                        <>
                          <Text className="text-xs text-muted">•</Text>
                          <Text className="text-xs text-muted">{book.pageCount} pages</Text>
                        </>
                      )}
                    </View>
                  </View>

                  {/* Add Button */}
                  {isAdding ? (
                    <View className="items-center justify-center px-4">
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  ) : (
                    <View className="items-center justify-center px-4">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text className="text-lg font-bold" style={{ color: colors.background }}>
                          +
                        </Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
