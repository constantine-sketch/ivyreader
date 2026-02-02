import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function FirstBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const addBookMutation = trpc.books.create.useMutation();
  const utils = trpc.useUtils();

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await utils.client.books.search.query({ query: searchInput });
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = async (book: any) => {
    setSelectedBook(book);
    try {
      await addBookMutation.mutateAsync({
        title: book.title,
        author: book.author,
        category: book.category || "General",
        totalPages: book.totalPages || 200,
        coverUrl: book.coverUrl,
        status: "reading",
      });
      
      // Continue to next step
      router.push({
        pathname: "/onboarding/notifications",
        params: {
          pagesPerWeek: params.pagesPerWeek as string,
          genres: params.genres as string,
        },
      });
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleSkip = () => {
    router.push({
      pathname: "/onboarding/notifications",
      params: {
        pagesPerWeek: params.pagesPerWeek as string,
        genres: params.genres as string,
      },
    });
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Progress Indicator */}
        <View className="flex-row gap-2 mt-6 mb-8">
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full bg-border" />
        </View>

        {/* Header */}
        <Text className="text-3xl font-bold text-foreground mb-2">
          Add Your First Book
        </Text>
        <Text className="text-base text-muted mb-8">
          What are you currently reading?
        </Text>

        {/* Search Input */}
        <View className="flex-row gap-3 mb-6">
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search for a book..."
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            className="flex-1 border-2 rounded-xl px-4 py-3 text-base text-foreground"
            style={{ borderColor: colors.border }}
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            onPress={handleSearch}
            className="px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            disabled={isSearching}
          >
            <Text className="font-semibold" style={{ color: colors.background }}>
              {isSearching ? "..." : "Search"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {isSearching && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View className="gap-3 mb-6">
            {searchResults.map((book, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectBook(book)}
                className="flex-row gap-3 p-3 rounded-xl border-2"
                style={{
                  borderColor: selectedBook?.title === book.title ? colors.primary : colors.border,
                  backgroundColor: selectedBook?.title === book.title ? `${colors.primary}10` : "transparent",
                }}
              >
                {book.coverUrl ? (
                  <Image
                    source={{ uri: book.coverUrl }}
                    style={{ width: 60, height: 90, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="items-center justify-center rounded-lg"
                    style={{ width: 60, height: 90, backgroundColor: colors.surface }}
                  >
                    <Text style={{ fontSize: 24 }}>📚</Text>
                  </View>
                )}
                <View className="flex-1 justify-center">
                  <Text className="text-base font-semibold text-foreground mb-1" numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text className="text-sm text-muted" numberOfLines={1}>
                    {book.author}
                  </Text>
                  {book.totalPages && (
                    <Text className="text-xs text-muted mt-1">
                      {book.totalPages} pages
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results */}
        {!isSearching && searchResults.length === 0 && searchInput && (
          <View className="items-center py-8">
            <Text className="text-muted text-center">
              No books found. Try a different search or skip this step.
            </Text>
          </View>
        )}

        {/* Skip Button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="w-full py-4 mt-4"
        >
          <Text className="text-center text-muted">
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
