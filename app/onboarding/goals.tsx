import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Business",
  "Self-Help",
  "Biography",
  "History",
  "Science",
  "Philosophy",
  "Psychology",
  "Technology",
];

const PAGE_GOALS = [50, 100, 150, 200, 300];

export default function GoalsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [pagesPerWeek, setPagesPerWeek] = useState<number>(100);
  const [customPages, setCustomPages] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = () => {
    const finalPages = customPages ? parseInt(customPages) : pagesPerWeek;
    // Store in AsyncStorage or pass to next screen
    router.push({
      pathname: "/onboarding/first-book",
      params: {
        pagesPerWeek: finalPages.toString(),
        genres: JSON.stringify(selectedGenres),
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
          <View className="flex-1 h-1 rounded-full bg-border" />
          <View className="flex-1 h-1 rounded-full bg-border" />
        </View>

        {/* Header */}
        <Text className="text-3xl font-bold text-foreground mb-2">
          Set Your Reading Goals
        </Text>
        <Text className="text-base text-muted mb-8">
          Help us personalize your experience
        </Text>

        {/* Pages Per Week */}
        <Text className="text-lg font-semibold text-foreground mb-3">
          How many pages do you want to read per week?
        </Text>
        
        <View className="flex-row flex-wrap gap-3 mb-6">
          {PAGE_GOALS.map((goal) => (
            <TouchableOpacity
              key={goal}
              onPress={() => {
                setPagesPerWeek(goal);
                setCustomPages("");
              }}
              className="px-6 py-3 rounded-full border-2"
              style={{
                borderColor: pagesPerWeek === goal && !customPages ? colors.primary : colors.border,
                backgroundColor: pagesPerWeek === goal && !customPages ? `${colors.primary}15` : "transparent",
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: pagesPerWeek === goal && !customPages ? colors.primary : colors.foreground,
                }}
              >
                {goal} pages
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-8">
          <Text className="text-sm text-muted mb-2">Or enter a custom goal:</Text>
          <TextInput
            value={customPages}
            onChangeText={(text) => {
              setCustomPages(text.replace(/[^0-9]/g, ""));
            }}
            placeholder="Enter pages per week"
            keyboardType="number-pad"
            returnKeyType="done"
            className="border-2 rounded-xl px-4 py-3 text-base text-foreground"
            style={{ borderColor: colors.border }}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Favorite Genres */}
        <Text className="text-lg font-semibold text-foreground mb-3">
          What genres do you enjoy? (Optional)
        </Text>
        
        <View className="flex-row flex-wrap gap-3 mb-8">
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              onPress={() => toggleGenre(genre)}
              className="px-4 py-2 rounded-full border-2"
              style={{
                borderColor: selectedGenres.includes(genre) ? colors.primary : colors.border,
                backgroundColor: selectedGenres.includes(genre) ? `${colors.primary}15` : "transparent",
              }}
            >
              <Text
                className="font-medium"
                style={{
                  color: selectedGenres.includes(genre) ? colors.primary : colors.foreground,
                }}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full rounded-full py-4 px-8 mb-4"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-center font-semibold text-lg" style={{ color: colors.background }}>
            Continue
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={() => router.push("/onboarding/first-book")}
          className="w-full py-3"
        >
          <Text className="text-center text-muted">
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
