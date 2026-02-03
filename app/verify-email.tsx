import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyMutation = trpc.user.verifyEmail.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Verification failed");
      }
    },
    onError: (error) => {
      setStatus("error");
      setErrorMessage(error.message || "An error occurred");
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus("error");
      setErrorMessage("No verification token provided");
    }
  }, [token]);

  return (
    <ScreenContainer className="flex-1 items-center justify-center p-6">
      {status === "loading" && (
        <View className="items-center">
          <ActivityIndicator size="large" color="#D4A574" />
          <Text className="text-lg text-muted mt-4">Verifying your email...</Text>
        </View>
      )}

      {status === "success" && (
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-green-500/20 items-center justify-center mb-4">
            <Text className="text-4xl">✓</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">Email Verified!</Text>
          <Text className="text-muted text-center mb-6">
            Your email has been successfully verified.{"\n"}
            You now have full access to IvyReader.
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            className="bg-primary px-8 py-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">Continue to App</Text>
          </Pressable>
        </View>
      )}

      {status === "error" && (
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-red-500/20 items-center justify-center mb-4">
            <Text className="text-4xl">✕</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">Verification Failed</Text>
          <Text className="text-muted text-center mb-6">{errorMessage}</Text>
          <View className="gap-3">
            <Pressable
              onPress={() => router.replace("/(tabs)")}
              className="bg-primary px-8 py-4 rounded-xl"
            >
              <Text className="text-white font-semibold text-lg">Go to App</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/(tabs)/profile")}
              className="bg-surface px-8 py-4 rounded-xl"
            >
              <Text className="text-foreground font-semibold">Resend Verification</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
