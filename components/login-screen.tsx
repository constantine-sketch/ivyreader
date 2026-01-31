import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";
import { useRouter } from "expo-router";

export function LoginScreen() {
  const colors = useColors();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const callbackUrl = await startOAuthLogin();
      console.log("[LoginScreen] OAuth callback URL:", callbackUrl);
      
      if (callbackUrl) {
        // Parse the callback URL to extract code and state
        const url = new URL(callbackUrl);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        
        console.log("[LoginScreen] Extracted params:", { code: code?.substring(0, 20), state: state?.substring(0, 20) });
        
        if (code && state) {
          // Navigate to the OAuth callback screen with the parameters
          router.push({
            pathname: "/oauth/callback",
            params: { code, state },
          });
        } else {
          console.error("[LoginScreen] Missing code or state in callback URL");
        }
      }
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
