import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function WelcomeScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer className="flex-1 justify-center px-8">
      <View className="items-center gap-6">
        {/* Logo/Icon */}
        <View className="mb-4">
          <Text style={{ fontSize: 80 }}>📚</Text>
        </View>

        {/* Welcome Text */}
        <Text className="text-4xl font-bold text-foreground text-center">
          Welcome to IvyReader
        </Text>
        
        <Text className="text-lg text-muted text-center leading-relaxed">
          Track your reading journey, connect with fellow readers, and build lasting reading habits
        </Text>

        {/* Features List */}
        <View className="gap-4 mt-6 w-full">
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 24 }}>📖</Text>
            <Text className="text-base text-foreground flex-1">
              Track books and reading progress
            </Text>
          </View>
          
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 24 }}>👥</Text>
            <Text className="text-base text-foreground flex-1">
              Connect with fellow readers
            </Text>
          </View>
          
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 24 }}>🎯</Text>
            <Text className="text-base text-foreground flex-1">
              Set and achieve reading goals
            </Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.push("/onboarding/profile")}
          className="mt-8 w-full rounded-full py-4 px-8"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-center font-semibold text-lg" style={{ color: colors.background }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
