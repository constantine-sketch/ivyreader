import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Animated } from "react-native";
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
  const [isAdding, setIsAdding] = useState(false);

  // Get user tier for styling
  const { data: user } = trpc.auth.me.useQuery();
  const isElite = user?.subscriptionTier === "elite";
  const accentColor = isElite ? "#FFD700" : "#D4A574";

  const addBookMutation = trpc.books.create.useMutation();
  const utils = trpc.useUtils();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
    setIsAdding(true);
    try {
      await addBookMutation.mutateAsync({
        title: book.title,
        author: book.author,
        category: book.category || "General",
        totalPages: book.totalPages || 200,
        coverUrl: book.coverUrl,
        status: "reading",
      });
      
      router.push({
        pathname: "/onboarding/notifications",
        params: {
          pagesPerWeek: params.pagesPerWeek as string,
          genres: params.genres as string,
        },
      });
    } catch (error) {
      console.error("Failed to add book:", error);
      setIsAdding(false);
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
    <ScreenContainer className="flex-1" containerClassName={isElite ? "bg-[#0a0a0a]" : "bg-background"}>
      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Progress Indicator */}
          <View className="flex-row gap-2 mt-6 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <View 
                key={step}
                className="flex-1 h-1.5 rounded-full"
                style={{ 
                  backgroundColor: step <= 3 ? accentColor : isElite ? "#333" : colors.border 
                }}
              />
            ))}
          </View>

          {/* Header */}
          <View className="items-center mb-8">
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Text style={{ fontSize: 32 }}>📚</Text>
            </View>
            <Text 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: isElite ? "#fff" : colors.foreground }}
            >
              Add Your First Book
            </Text>
            <Text 
              className="text-base text-center"
              style={{ color: isElite ? "#888" : colors.muted }}
            >
              What are you currently reading?
            </Text>
          </View>

          {/* Search Input */}
          <View className="flex-row gap-3 mb-6">
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search for a book..."
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              className="flex-1 rounded-xl px-4 py-4 text-base"
              style={{ 
                backgroundColor: isElite ? "#151515" : colors.surface,
                borderWidth: 1, 
                borderColor: isElite ? "#333" : colors.border,
                color: isElite ? "#fff" : colors.foreground,
              }}
              placeholderTextColor={isElite ? "#555" : colors.muted}
            />
            <TouchableOpacity
              onPress={handleSearch}
              className="px-6 rounded-xl items-center justify-center"
              style={{ backgroundColor: accentColor }}
              disabled={isSearching}
            >
              <Text 
                className="font-bold"
                style={{ color: isElite ? "#000" : "#fff" }}
              >
                {isSearching ? "..." : "Search"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {isSearching && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={accentColor} />
              <Text 
                className="mt-3 text-sm"
                style={{ color: isElite ? "#666" : colors.muted }}
              >
                Searching books...
              </Text>
            </View>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View className="gap-3 mb-6">
              <Text 
                className="text-xs font-bold tracking-widest mb-2"
                style={{ color: accentColor }}
              >
                SEARCH RESULTS
              </Text>
              {searchResults.map((book, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectBook(book)}
                  disabled={isAdding}
                  className="flex-row gap-4 p-4 rounded-2xl"
                  style={{
                    backgroundColor: selectedBook?.title === book.title 
                      ? `${accentColor}20` 
                      : isElite ? "#151515" : colors.surface,
                    borderWidth: 2,
                    borderColor: selectedBook?.title === book.title 
                      ? accentColor 
                      : isElite ? "#333" : colors.border,
                    opacity: isAdding && selectedBook?.title !== book.title ? 0.5 : 1,
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
                      style={{ 
                        width: 60, 
                        height: 90, 
                        backgroundColor: isElite ? "#222" : colors.border 
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>📖</Text>
                    </View>
                  )}
                  <View className="flex-1 justify-center">
                    <Text 
                      className="text-base font-semibold mb-1" 
                      numberOfLines={2}
                      style={{ color: isElite ? "#fff" : colors.foreground }}
                    >
                      {book.title}
                    </Text>
                    <Text 
                      className="text-sm" 
                      numberOfLines={1}
                      style={{ color: isElite ? "#888" : colors.muted }}
                    >
                      {book.author}
                    </Text>
                    {book.totalPages && (
                      <Text 
                        className="text-xs mt-1"
                        style={{ color: isElite ? "#666" : colors.muted }}
                      >
                        {book.totalPages} pages
                      </Text>
                    )}
                  </View>
                  {selectedBook?.title === book.title && isAdding && (
                    <View className="justify-center">
                      <ActivityIndicator size="small" color={accentColor} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* No Results */}
          {!isSearching && searchResults.length === 0 && searchInput && (
            <View 
              className="items-center py-8 px-4 rounded-2xl"
              style={{ backgroundColor: isElite ? "#151515" : colors.surface }}
            >
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
              <Text 
                className="text-center"
                style={{ color: isElite ? "#888" : colors.muted }}
              >
                No books found. Try a different search or skip this step.
              </Text>
            </View>
          )}

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            className="w-full py-4 mt-4"
            disabled={isAdding}
          >
            <Text 
              className="text-center"
              style={{ color: isElite ? "#555" : colors.muted }}
            >
              Skip for now
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}
