/**
 * List Detail Screen
 * 
 * Shows books in a curated reading list with ability to add to library.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";
import { trpc } from "@/lib/trpc";

// Curated lists data
const CURATED_LISTS: Record<string, { title: string; description: string; books: Array<{ title: string; author: string; pages: number; coverKey?: string }> }> = {
  "ivy-league-prep": {
    title: "Ivy League Essentials",
    description: "Must-reads recommended by top university professors",
    books: [
      { title: "Sapiens", author: "Yuval Noah Harari", pages: 443 },
      { title: "The Republic", author: "Plato", pages: 416 },
      { title: "1984", author: "George Orwell", pages: 328 },
      { title: "The Selfish Gene", author: "Richard Dawkins", pages: 360 },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", pages: 499 },
    ],
  },
  "business-titans": {
    title: "Business Titans",
    description: "Books that shaped the world's most successful entrepreneurs",
    books: [
      { title: "The Lean Startup", author: "Eric Ries", pages: 336 },
      { title: "$100M Offers", author: "Alex Hormozi", pages: 208 },
      { title: "Traction", author: "Gabriel Weinberg", pages: 256 },
      { title: "The E-Myth Revisited", author: "Michael Gerber", pages: 288 },
    ],
  },
  "deep-work": {
    title: "Deep Work Mastery",
    description: "Essential books for developing focus and eliminating distractions",
    books: [
      { title: "Deep Work", author: "Cal Newport", pages: 304 },
      { title: "Atomic Habits", author: "James Clear", pages: 320 },
      { title: "The One Thing", author: "Gary Keller", pages: 256 },
      { title: "Essentialism", author: "Greg McKeown", pages: 272 },
    ],
  },
  "mental-models": {
    title: "Mental Models & Thinking",
    description: "Frameworks for better decision-making and problem-solving",
    books: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", pages: 499 },
      { title: "The Art of Thinking Clearly", author: "Rolf Dobelli", pages: 384 },
      { title: "Poor Charlie's Almanack", author: "Charles Munger", pages: 548 },
      { title: "Superforecasting", author: "Philip Tetlock", pages: 352 },
    ],
  },
  "financial-literacy": {
    title: "Financial Intelligence",
    description: "Build wealth and understand money management",
    books: [
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", pages: 336 },
      { title: "The Intelligent Investor", author: "Benjamin Graham", pages: 640 },
      { title: "I Will Teach You to Be Rich", author: "Ramit Sethi", pages: 352 },
      { title: "The Psychology of Money", author: "Morgan Housel", pages: 256 },
    ],
  },
  "philosophy-101": {
    title: "Philosophy 101",
    description: "Essential philosophical works for the curious mind",
    books: [
      { title: "Meditations", author: "Marcus Aurelius", pages: 256 },
      { title: "The Republic", author: "Plato", pages: 416 },
      { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", pages: 240 },
      { title: "The Stranger", author: "Albert Camus", pages: 123 },
    ],
  },
};

export default function ListDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  const { accentColor, isDarkTheme } = useTierAccess();
  const utils = trpc.useUtils();
  
  const listId = (params.listId as string) || "ivy-essentials";
  const listData = CURATED_LISTS[listId] || CURATED_LISTS["ivy-essentials"];
  
  const [addingBook, setAddingBook] = useState<string | null>(null);
  const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());
  
  // Theme colors
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  
  const createBook = trpc.books.create.useMutation({
    onSuccess: () => {
      utils.books.list.invalidate();
    },
  });
  
  const handleAddBook = async (book: { title: string; author: string; pages: number }) => {
    const bookKey = `${book.title}-${book.author}`;
    if (addedBooks.has(bookKey)) return;
    
    setAddingBook(bookKey);
    
    try {
      await createBook.mutateAsync({
        title: book.title,
        author: book.author,
        totalPages: book.pages,
        status: "queue",
        category: "Non-Fiction",
      });
      
      setAddedBooks(prev => new Set([...prev, bookKey]));
      
      if (Platform.OS === 'web') {
        // Don't show alert on web, just update UI
      } else {
        Alert.alert('Added!', `"${book.title}" has been added to your queue.`);
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Failed to add book. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to add book. Please try again.');
      }
    } finally {
      setAddingBook(null);
    }
  };

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
            style={{ color: textColor }}
          >
            {listData.title}
          </Text>
          <Text 
            className="text-base"
            style={{ color: mutedColor }}
          >
            {listData.description}
          </Text>
        </View>

        {/* Books */}
        <Text 
          className="text-xs font-bold tracking-widest mb-4"
          style={{ color: accentColor }}
        >
          {listData.books.length} BOOKS IN THIS LIST
        </Text>

        {listData.books.map((book, index) => {
          const bookKey = `${book.title}-${book.author}`;
          const isAdding = addingBook === bookKey;
          const isAdded = addedBooks.has(bookKey);
          
          return (
            <View
              key={index}
              className="flex-row p-4 rounded-2xl mb-3"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
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
                  style={{ color: textColor }}
                >
                  {book.title}
                </Text>
                <Text 
                  className="text-sm"
                  style={{ color: mutedColor }}
                >
                  {book.author} · {book.pages} pages
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAddBook(book)}
                disabled={isAdding || isAdded}
                className="px-4 py-2 rounded-xl self-center"
                style={{ 
                  backgroundColor: isAdded ? colors.success : accentColor,
                  opacity: isAdding ? 0.7 : 1,
                }}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color={isDarkTheme ? "#000" : "#fff"} />
                ) : (
                  <Text 
                    className="font-semibold text-sm"
                    style={{ color: isDarkTheme ? "#000" : "#fff" }}
                  >
                    {isAdded ? "Added ✓" : "Add"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
        
        {/* Add All Button */}
        <TouchableOpacity
          onPress={async () => {
            for (const book of listData.books) {
              const bookKey = `${book.title}-${book.author}`;
              if (!addedBooks.has(bookKey)) {
                await handleAddBook(book);
              }
            }
          }}
          className="mt-4 py-4 rounded-xl items-center"
          style={{ 
            backgroundColor: `${accentColor}20`,
            borderWidth: 2,
            borderColor: accentColor,
          }}
        >
          <Text className="font-bold" style={{ color: accentColor }}>
            Add All Books to Queue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
