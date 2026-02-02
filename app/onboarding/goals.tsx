import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const GENRES = [
  { name: "Fiction", emoji: "📖" },
  { name: "Non-Fiction", emoji: "📰" },
  { name: "Business", emoji: "💼" },
  { name: "Self-Help", emoji: "🌱" },
  { name: "Biography", emoji: "👤" },
  { name: "History", emoji: "🏛️" },
  { name: "Science", emoji: "🔬" },
  { name: "Philosophy", emoji: "🤔" },
  { name: "Psychology", emoji: "🧠" },
  { name: "Technology", emoji: "💻" },
];

const PAGE_GOALS = [
  { pages: 50, label: "Casual", desc: "~7 pages/day" },
  { pages: 100, label: "Regular", desc: "~14 pages/day" },
  { pages: 150, label: "Avid", desc: "~21 pages/day" },
  { pages: 200, label: "Dedicated", desc: "~28 pages/day" },
  { pages: 300, label: "Voracious", desc: "~43 pages/day" },
];

export default function GoalsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [pagesPerWeek, setPagesPerWeek] = useState<number>(100);
  const [customPages, setCustomPages] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Get user tier for styling
  const { data: user } = trpc.auth.me.useQuery();
  const isElite = user?.subscriptionTier === "elite";
  const accentColor = isElite ? "#FFD700" : "#D4A574";

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = () => {
    const finalPages = customPages ? parseInt(customPages) : pagesPerWeek;
    router.push({
      pathname: "/onboarding/first-book",
      params: {
        pagesPerWeek: finalPages.toString(),
        genres: JSON.stringify(selectedGenres),
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
                  backgroundColor: step <= 2 ? accentColor : isElite ? "#333" : colors.border 
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
              <Text style={{ fontSize: 32 }}>🎯</Text>
            </View>
            <Text 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: isElite ? "#fff" : colors.foreground }}
            >
              Set Your Goals
            </Text>
            <Text 
              className="text-base text-center"
              style={{ color: isElite ? "#888" : colors.muted }}
            >
              We'll help you stay on track
            </Text>
          </View>

          {/* Pages Per Week */}
          <Text 
            className="text-xs font-bold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            WEEKLY READING GOAL
          </Text>
          
          <View className="gap-3 mb-6">
            {PAGE_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.pages}
                onPress={() => {
                  setPagesPerWeek(goal.pages);
                  setCustomPages("");
                }}
                className="flex-row items-center p-4 rounded-2xl"
                style={{
                  backgroundColor: pagesPerWeek === goal.pages && !customPages 
                    ? `${accentColor}20` 
                    : isElite ? "#151515" : colors.surface,
                  borderWidth: 2,
                  borderColor: pagesPerWeek === goal.pages && !customPages 
                    ? accentColor 
                    : isElite ? "#333" : colors.border,
                }}
              >
                <View className="flex-1">
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: isElite ? "#fff" : colors.foreground }}
                  >
                    {goal.pages} pages/week
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: isElite ? "#666" : colors.muted }}
                  >
                    {goal.label} · {goal.desc}
                  </Text>
                </View>
                {pagesPerWeek === goal.pages && !customPages && (
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Text style={{ color: isElite ? "#000" : "#fff", fontSize: 12 }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-8">
            <Text 
              className="text-sm mb-2"
              style={{ color: isElite ? "#666" : colors.muted }}
            >
              Or set a custom goal:
            </Text>
            <TextInput
              value={customPages}
              onChangeText={(text) => setCustomPages(text.replace(/[^0-9]/g, ""))}
              placeholder="Enter pages per week"
              keyboardType="number-pad"
              returnKeyType="done"
              className="rounded-xl px-4 py-4 text-base"
              style={{ 
                backgroundColor: isElite ? "#151515" : colors.surface,
                borderWidth: 1, 
                borderColor: isElite ? "#333" : colors.border,
                color: isElite ? "#fff" : colors.foreground,
              }}
              placeholderTextColor={isElite ? "#555" : colors.muted}
            />
          </View>

          {/* Favorite Genres */}
          <Text 
            className="text-xs font-bold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            FAVORITE GENRES (OPTIONAL)
          </Text>
          
          <View className="flex-row flex-wrap gap-2 mb-8">
            {GENRES.map((genre) => (
              <TouchableOpacity
                key={genre.name}
                onPress={() => toggleGenre(genre.name)}
                className="flex-row items-center px-4 py-2 rounded-full"
                style={{
                  backgroundColor: selectedGenres.includes(genre.name) 
                    ? `${accentColor}20` 
                    : isElite ? "#151515" : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedGenres.includes(genre.name) 
                    ? accentColor 
                    : isElite ? "#333" : colors.border,
                }}
              >
                <Text className="mr-1">{genre.emoji}</Text>
                <Text
                  className="font-medium"
                  style={{
                    color: selectedGenres.includes(genre.name) 
                      ? accentColor 
                      : isElite ? "#fff" : colors.foreground,
                  }}
                >
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            className="w-full rounded-2xl py-4 mb-4"
            style={{ 
              backgroundColor: accentColor,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text 
              className="text-center font-bold text-lg"
              style={{ color: isElite ? "#000" : "#fff" }}
            >
              Continue
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={() => router.push("/onboarding/first-book")}
            className="w-full py-3"
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
