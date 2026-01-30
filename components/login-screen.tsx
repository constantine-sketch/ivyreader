import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";

export function LoginScreen() {
  const colors = useColors();

  const handleLogin = async () => {
    try {
      await startOAuthLogin();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.background }}>
      <View className="items-center mb-12">
        <Text className="text-5xl font-bold mb-4" style={{ color: colors.primary }}>
          IvyReader
        </Text>
        <Text className="text-lg text-center" style={{ color: colors.muted }}>
          Track your reading journey,{"\n"}connect with fellow readers
        </Text>
      </View>

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [{
          backgroundColor: colors.primary,
          paddingHorizontal: 48,
          paddingVertical: 16,
          borderRadius: 12,
          opacity: pressed ? 0.8 : 1,
        }]}
      >
        <Text className="text-lg font-bold" style={{ color: colors.background }}>
          Sign In with Manus
        </Text>
      </Pressable>

      <Text className="mt-8 text-center text-sm" style={{ color: colors.muted }}>
        Join thousands of readers tracking{"\n"}their literary adventures
      </Text>
    </View>
  );
}
