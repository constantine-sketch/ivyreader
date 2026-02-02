import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface ReadingList {
  id: string;
  title: string;
  description: string;
  books: { title: string; author: string }[];
  category: string;
}

// Mock curated reading lists (will be replaced with database later)
const CURATED_LISTS: ReadingList[] = [
  {
    id: "deep-work",
    title: "Deep Work Mastery",
    description: "Essential books for developing focus and eliminating distractions",
    category: "Productivity",
    books: [
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Atomic Habits", author: "James Clear" },
      { title: "The One Thing", author: "Gary Keller" },
      { title: "Essentialism", author: "Greg McKeown" },
    ],
  },
  {
    id: "business-fundamentals",
    title: "Business Fundamentals",
    description: "Core principles every entrepreneur should master",
    category: "Business",
    books: [
      { title: "The Lean Startup", author: "Eric Ries" },
      { title: "$100M Offers", author: "Alex Hormozi" },
      { title: "Traction", author: "Gabriel Weinberg" },
      { title: "The E-Myth Revisited", author: "Michael Gerber" },
    ],
  },
  {
    id: "mental-models",
    title: "Mental Models & Thinking",
    description: "Frameworks for better decision-making and problem-solving",
    category: "Psychology",
    books: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "The Art of Thinking Clearly", author: "Rolf Dobelli" },
      { title: "Poor Charlie's Almanack", author: "Charles Munger" },
      { title: "Superforecasting", author: "Philip Tetlock" },
    ],
  },
  {
    id: "ivy-league-prep",
    title: "Ivy League Reading List",
    description: "Books that impress admissions officers and build intellectual depth",
    category: "Education",
    books: [
      { title: "Sapiens", author: "Yuval Noah Harari" },
      { title: "The Republic", author: "Plato" },
      { title: "1984", author: "George Orwell" },
      { title: "The Selfish Gene", author: "Richard Dawkins" },
    ],
  },
  {
    id: "financial-literacy",
    title: "Financial Intelligence",
    description: "Build wealth and understand money management",
    category: "Finance",
    books: [
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
      { title: "The Intelligent Investor", author: "Benjamin Graham" },
      { title: "I Will Teach You to Be Rich", author: "Ramit Sethi" },
      { title: "The Psychology of Money", author: "Morgan Housel" },
    ],
  },
];

export default function ReadingListsScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(CURATED_LISTS.map((list) => list.category)));

  const filteredLists = selectedCategory
    ? CURATED_LISTS.filter((list) => list.category === selectedCategory)
    : CURATED_LISTS;

  const isPremiumUser = user?.subscriptionTier === "premium" || user?.subscriptionTier === "elite";

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6">
        {/* Header with Back Button */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-lg"
              style={({ pressed }) => [{
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </Pressable>
            <Text className="text-3xl font-bold text-foreground">
              Curated Reading Lists
            </Text>
          </View>
          <Text className="text-base text-muted">
            Expert-curated book collections for focused learning
          </Text>
        </View>

        {/* Premium Badge */}
        {!isPremiumUser && (
          <View
            className="p-4 rounded-xl mb-6 border"
            style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary }}
          >
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.primary }}>
              Premium Feature
            </Text>
            <Text className="text-sm text-muted mb-3">
              Upgrade to Premium to unlock all curated reading lists and monthly updates
            </Text>
            <Pressable
              onPress={() => router.push("/subscription")}
              className="py-2 px-4 rounded-lg self-start"
              style={({ pressed }) => [{
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1
              }]}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.background }}>
                Upgrade Now
              </Text>
            </Pressable>
          </View>
        )}

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            className="px-4 py-2 rounded-full border"
            style={{
              backgroundColor: selectedCategory === null ? colors.primary : "transparent",
              borderColor: colors.primary,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: selectedCategory === null ? colors.background : colors.primary }}
            >
              All
            </Text>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full border"
              style={{
                backgroundColor: selectedCategory === category ? colors.primary : "transparent",
                borderColor: colors.primary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: selectedCategory === category ? colors.background : colors.primary }}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Reading Lists */}
        <View className="gap-4">
          {filteredLists.map((list, index) => {
            const isLocked = !isPremiumUser && index > 0; // First list is free

            return (
              <View
                key={list.id}
                className="rounded-2xl p-5 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground mb-1">
                      {list.title}
                    </Text>
                    <Text className="text-sm text-muted mb-2">{list.description}</Text>
                    <View
                      className="px-2 py-1 rounded self-start"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                        {list.category}
                      </Text>
                    </View>
                  </View>
                  {isLocked && (
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <Text className="text-lg">🔒</Text>
                    </View>
                  )}
                </View>

                {/* Book List */}
                <View className="gap-2 mb-4">
                  {list.books.map((book, idx) => (
                    <View key={idx} className="flex-row items-center">
                      <Text className="text-muted mr-2">•</Text>
                      <Text className="text-sm text-foreground flex-1">
                        <Text className="font-semibold">{book.title}</Text>
                        <Text className="text-muted"> by {book.author}</Text>
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Action Button */}
                {isLocked ? (
                  <Pressable
                    onPress={() => router.push("/subscription")}
                    className="py-3 rounded-lg items-center border"
                    style={{ borderColor: colors.primary }}
                  >
                    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                      Unlock with Premium
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    className="py-3 rounded-lg items-center"
                    style={({ pressed }) => [{
                      backgroundColor: colors.primary,
                      opacity: pressed ? 0.8 : 1
                    }]}
                  >
                    <Text className="text-sm font-semibold" style={{ color: colors.background }}>
                      Add All to Library
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
