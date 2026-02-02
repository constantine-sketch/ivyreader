/**
 * Curated Reading Lists - Premium Feature
 * 
 * Expertly curated book collections by theme and genre.
 */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Animated } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierGate, TierBadge, UpgradeModal } from "@/components/tier-gate";

interface ReadingList {
  id: string;
  title: string;
  description: string;
  books: { title: string; author: string }[];
  category: string;
  coverImage?: string;
  featured?: boolean;
}

// Curated reading lists with cover images
const CURATED_LISTS: ReadingList[] = [
  {
    id: "ivy-league-prep",
    title: "Ivy League Essentials",
    description: "Must-reads recommended by top university professors",
    category: "Academic",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    books: [
      { title: "Sapiens", author: "Yuval Noah Harari" },
      { title: "The Republic", author: "Plato" },
      { title: "1984", author: "George Orwell" },
      { title: "The Selfish Gene", author: "Richard Dawkins" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
    ],
  },
  {
    id: "business-titans",
    title: "Business Titans",
    description: "Books that shaped the world's most successful entrepreneurs",
    category: "Business",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    books: [
      { title: "The Lean Startup", author: "Eric Ries" },
      { title: "$100M Offers", author: "Alex Hormozi" },
      { title: "Traction", author: "Gabriel Weinberg" },
      { title: "The E-Myth Revisited", author: "Michael Gerber" },
    ],
  },
  {
    id: "deep-work",
    title: "Deep Work Mastery",
    description: "Essential books for developing focus and eliminating distractions",
    category: "Productivity",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    books: [
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Atomic Habits", author: "James Clear" },
      { title: "The One Thing", author: "Gary Keller" },
      { title: "Essentialism", author: "Greg McKeown" },
    ],
  },
  {
    id: "mental-models",
    title: "Mental Models & Thinking",
    description: "Frameworks for better decision-making and problem-solving",
    category: "Psychology",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    books: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "The Art of Thinking Clearly", author: "Rolf Dobelli" },
      { title: "Poor Charlie's Almanack", author: "Charles Munger" },
      { title: "Superforecasting", author: "Philip Tetlock" },
    ],
  },
  {
    id: "financial-literacy",
    title: "Financial Intelligence",
    description: "Build wealth and understand money management",
    category: "Finance",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    books: [
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
      { title: "The Intelligent Investor", author: "Benjamin Graham" },
      { title: "I Will Teach You to Be Rich", author: "Ramit Sethi" },
      { title: "The Psychology of Money", author: "Morgan Housel" },
    ],
  },
  {
    id: "philosophy-101",
    title: "Philosophy 101",
    description: "Essential philosophical works for the curious mind",
    category: "Philosophy",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    books: [
      { title: "Meditations", author: "Marcus Aurelius" },
      { title: "The Republic", author: "Plato" },
      { title: "Beyond Good and Evil", author: "Friedrich Nietzsche" },
      { title: "The Stranger", author: "Albert Camus" },
    ],
  },
];

const CATEGORIES = ["All", "Academic", "Business", "Productivity", "Psychology", "Finance", "Philosophy"];

export default function ReadingListsScreen() {
  const colors = useColors();
  const { accentColor, isDarkTheme, isPremiumOrHigher, isElite, canAccess } = useTierAccess();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredLists = selectedCategory === "All"
    ? CURATED_LISTS
    : CURATED_LISTS.filter((list) => list.category === selectedCategory);

  const featuredLists = CURATED_LISTS.filter(list => list.featured);
  // Premium and Elite both have full access to lists
  const hasAccess = isPremiumOrHigher;

  const handleListPress = (list: ReadingList, isLocked: boolean) => {
    if (isLocked) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/list-detail?listId=${list.id}`);
    }
  };

  return (
    <ScreenContainer
      containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}
    >
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
            />
          }
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-3xl font-bold"
                style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
              >
                Reading Lists
              </Text>
              <TierBadge size="small" />
            </View>
            <Text
              className="text-base"
              style={{ color: isDarkTheme ? "#888" : colors.muted }}
            >
              Expertly curated collections for every reader
            </Text>
          </View>

          {/* Elite Upgrade Banner (for non-elite users) */}
          {!isElite && (
            <View className="px-6 mb-6">
              <TouchableOpacity
                onPress={() => setShowUpgradeModal(true)}
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderWidth: 2,
                  borderColor: accentColor,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 24, marginRight: 8 }}>⭐</Text>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
                  >
                    Unlock All Reading Lists
                  </Text>
                </View>
                <Text
                  className="text-sm mb-4"
                  style={{ color: isDarkTheme ? "#888" : colors.muted }}
                >
                  Upgrade to Elite to access AI-powered recommendations, advanced analytics, and exclusive Elite features.
                </Text>
                <View
                  className="self-start px-5 py-2 rounded-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text
                    className="font-bold"
                    style={{ color: isDarkTheme ? "#000" : "#fff" }}
                  >
                    Upgrade to Elite
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Featured Lists */}
          <View className="mb-6">
            <Text
              className="text-xs font-bold tracking-widest px-6 mb-4"
              style={{ color: accentColor }}
            >
              FEATURED COLLECTIONS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {featuredLists.map((list) => {
                const isLocked = false; // Premium has full access
                return (
                  <TouchableOpacity
                    key={list.id}
                    onPress={() => handleListPress(list, isLocked)}
                    className="mr-4"
                    style={{ width: 280, opacity: isLocked ? 0.7 : 1 }}
                  >
                    <View
                      className="rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: isDarkTheme ? "#151515" : colors.surface,
                        borderWidth: 1,
                        borderColor: isDarkTheme ? "#333" : colors.border,
                      }}
                    >
                      <View style={{ position: "relative" }}>
                        <Image
                          source={{ uri: list.coverImage }}
                          style={{ width: "100%", height: 140 }}
                          resizeMode="cover"
                        />
                        {isLocked && (
                          <View
                            className="absolute top-3 right-3 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                          >
                            <Text style={{ fontSize: 18 }}>🔒</Text>
                          </View>
                        )}
                      </View>
                      <View className="p-4">
                        <Text
                          className="text-lg font-bold mb-1"
                          style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
                        >
                          {list.title}
                        </Text>
                        <Text
                          className="text-sm mb-2"
                          style={{ color: isDarkTheme ? "#888" : colors.muted }}
                          numberOfLines={2}
                        >
                          {list.description}
                        </Text>
                        <View className="flex-row items-center">
                          <Text style={{ fontSize: 14 }}>📚</Text>
                          <Text
                            className="text-xs ml-1"
                            style={{ color: accentColor }}
                          >
                            {list.books.length} books
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Category Filter */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className="mr-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: selectedCategory === category
                      ? accentColor
                      : isDarkTheme ? "#151515" : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedCategory === category
                      ? accentColor
                      : isDarkTheme ? "#333" : colors.border,
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: selectedCategory === category
                        ? (isDarkTheme ? "#000" : "#fff")
                        : (isDarkTheme ? "#fff" : colors.foreground)
                    }}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* All Lists */}
          <View className="px-6 pb-8">
            <Text
              className="text-xs font-bold tracking-widest mb-4"
              style={{ color: accentColor }}
            >
              ALL COLLECTIONS
            </Text>

            {filteredLists.map((list) => {
              const isLocked = false; // Premium has full access
              return (
                <TouchableOpacity
                  key={list.id}
                  onPress={() => handleListPress(list, isLocked)}
                  className="mb-4 rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: isDarkTheme ? "#151515" : colors.surface,
                    borderWidth: 1,
                    borderColor: isDarkTheme ? "#333" : colors.border,
                    opacity: isLocked ? 0.7 : 1,
                  }}
                >
                  <View className="flex-row">
                    <View style={{ position: "relative" }}>
                      <Image
                        source={{ uri: list.coverImage }}
                        style={{ width: 100, height: 120 }}
                        resizeMode="cover"
                      />
                      {isLocked && (
                        <View
                          className="absolute inset-0 items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        >
                          <Text style={{ fontSize: 24 }}>🔒</Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-1 p-4 justify-center">
                      <Text
                        className="text-base font-bold mb-1"
                        style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
                      >
                        {list.title}
                      </Text>
                      <Text
                        className="text-sm mb-2"
                        style={{ color: isDarkTheme ? "#888" : colors.muted }}
                        numberOfLines={2}
                      >
                        {list.description}
                      </Text>
                      <View className="flex-row items-center">
                        <View
                          className="px-2 py-1 rounded-full mr-2"
                          style={{ backgroundColor: `${accentColor}20` }}
                        >
                          <Text
                            className="text-xs font-medium"
                            style={{ color: accentColor }}
                          >
                            {list.category}
                          </Text>
                        </View>
                        <Text
                          className="text-xs"
                          style={{ color: isDarkTheme ? "#666" : colors.muted }}
                        >
                          {list.books.length} books
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Upgrade Modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        targetTier="elite"
      />
    </ScreenContainer>
  );
}
