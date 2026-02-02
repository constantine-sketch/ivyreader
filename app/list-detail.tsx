/**
 * List Detail Screen
 * 
 * Shows books in a curated reading list.
 */

import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";

// Sample books in list
const LIST_BOOKS = [
  { id: "1", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", pages: 499 },
  { id: "2", title: "Sapiens", author: "Yuval Noah Harari", pages: 443 },
  { id: "3", title: "The Lean Startup", author: "Eric Ries", pages: 336 },
  { id: "4", title: "Atomic Habits", author: "James Clear", pages: 320 },
  { id: "5", title: "Deep Work", author: "Cal Newport", pages: 304 },
];

export default function ListDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  const { accentColor, isDarkTheme } = useTierAccess();

  return (
    <ScreenContainer 
      className="flex-1"
      containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}
    >
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center py-4"
        >
          <Text style={{ color: accentColor }}>← Back to Lists</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text 
            className="text-3xl font-bold mb-2"
            style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
          >
            Ivy League Essentials
          </Text>
          <Text 
            className="text-base"
            style={{ color: isDarkTheme ? "#888" : colors.muted }}
          >
            Must-reads recommended by top university professors
          </Text>
        </View>

        {/* Books */}
        <Text 
          className="text-xs font-bold tracking-widest mb-4"
          style={{ color: accentColor }}
        >
          {LIST_BOOKS.length} BOOKS IN THIS LIST
        </Text>

        {LIST_BOOKS.map((book) => (
          <TouchableOpacity
            key={book.id}
            className="flex-row p-4 rounded-2xl mb-3"
            style={{ 
              backgroundColor: isDarkTheme ? "#151515" : colors.surface,
              borderWidth: 1,
              borderColor: isDarkTheme ? "#333" : colors.border,
            }}
          >
            <View 
              className="w-12 h-16 rounded-lg items-center justify-center mr-4"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Text style={{ fontSize: 24 }}>📖</Text>
            </View>
            <View className="flex-1 justify-center">
              <Text 
                className="text-base font-semibold mb-1"
                style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
              >
                {book.title}
              </Text>
              <Text 
                className="text-sm"
                style={{ color: isDarkTheme ? "#888" : colors.muted }}
              >
                {book.author} · {book.pages} pages
              </Text>
            </View>
            <TouchableOpacity
              className="px-4 py-2 rounded-xl self-center"
              style={{ backgroundColor: accentColor }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: isDarkTheme ? "#000" : "#fff" }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
