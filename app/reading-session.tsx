import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const MOTIVATIONAL_QUOTES = [
  "The more you read, the more you know. The more you know, the more you grow.",
  "Reading is to the mind what exercise is to the body. - Joseph Addison",
  "A reader lives a thousand lives before he dies. - George R.R. Martin",
  "The mind is everything. What you think, you become. - Buddha",
  "Knowledge is power. - Francis Bacon",
  "In reading great literature I become a thousand men and yet remain myself. - C.S. Lewis",
  "Books are a uniquely portable magic. - Stephen King",
  "Reading is essential for those who seek to rise above the ordinary. - Jim Rohn",
  "There is no friend as loyal as a book. - Ernest Hemingway",
  "The reading of all good books is like a conversation with the finest minds. - Descartes",
  "Discipline equals freedom. - Jocko Willink",
  "The obstacle is the way. - Ryan Holiday",
  "Focus on what you can control. - Marcus Aurelius",
  "Excellence is not a destination; it is a continuous journey. - Brian Tracy",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
];

export default function ReadingSessionScreen() {
  const colors = useColors();
  const router = useRouter();
  const { bookId } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Fetch book details
  const { data: books } = trpc.books.list.useQuery();
  const book = books?.find((b) => b.id === Number(bookId));



  // Set random quote on mount
  useEffect(() => {
    if (book) {
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [book]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndSession = () => {
    if (!book) return;

    // Ensure at least 1 minute duration (backend requires positive int)
    const durationMinutes = Math.max(1, Math.round(seconds / 60));

    // Navigate to post-session page where user enters takeaways and page numbers
    router.push({
      pathname: '/post-session-note',
      params: {
        bookId: book.id.toString(),
        bookTitle: book.title,
        bookAuthor: book.author,
        startPage: book.currentPage.toString(),
        endPage: book.currentPage.toString(),
        durationMinutes: durationMinutes.toString(),
      },
    });
  };

  if (!book) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-8 justify-between">
          {/* Header */}
          <View>
            <Pressable onPress={() => router.back()} className="mb-6">
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-3xl font-bold text-foreground mb-2">{book.title}</Text>
            <Text className="text-sm text-muted">{book.author}</Text>
          </View>

          {/* Motivational Quote */}
          <View className="bg-primary/10 rounded-2xl p-6 mb-8">
            <Text className="text-lg text-foreground italic leading-relaxed">"{quote}"</Text>
          </View>

          {/* Timer */}
          <View className="items-center mb-8">
            <Text className="text-6xl font-bold text-primary mb-4 font-mono">
              {formatTime(seconds)}
            </Text>
            <Text className="text-sm text-muted">Reading Time</Text>
          </View>

          {/* Controls */}
          <View className="gap-3">
            {/* Pause/Resume Button */}
            <Pressable
              onPress={() => setIsRunning(!isRunning)}
              className="py-4 rounded-lg items-center border-2"
              style={{ 
                backgroundColor: isRunning ? 'transparent' : colors.primary,
                borderColor: colors.primary,
              }}
            >
              <Text className="text-lg font-bold" style={{ color: isRunning ? colors.primary : colors.background }}>
                {isRunning ? "⏸ Pause Timer" : "▶ Resume Timer"}
              </Text>
            </Pressable>

            {/* End Session Button */}
            <Pressable
              onPress={handleEndSession}
              className="py-4 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-lg font-bold" style={{ color: colors.background }}>
                ✓ End Session & Add Takeaways
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
