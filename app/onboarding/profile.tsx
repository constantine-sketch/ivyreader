import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const AVATAR_OPTIONS = ["👤", "📚", "🎓", "✨", "🌟", "💡", "🔥", "🚀", "🎯", "💎"];

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const utils = trpc.useUtils();

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Username Required", "Please enter a username to continue.");
      return;
    }

    // Validate username format (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert("Invalid Username", "Username can only contain letters, numbers, and underscores.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        avatar: selectedAvatar,
      });

      // Invalidate user query to refresh profile data
      await utils.auth.me.invalidate();

      router.push("/onboarding/goals");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1 px-6">
        {/* Progress Indicator */}
        <View className="flex-row gap-2 mt-6 mb-8">
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full bg-border" />
          <View className="flex-1 h-1 rounded-full bg-border" />
          <View className="flex-1 h-1 rounded-full bg-border" />
        </View>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Create Your Profile
          </Text>
          <Text className="text-base text-muted">
            Let's set up your reading identity
          </Text>
        </View>

        {/* Avatar Selection */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Choose Your Avatar
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {AVATAR_OPTIONS.map((avatar) => (
              <TouchableOpacity
                key={avatar}
                onPress={() => setSelectedAvatar(avatar)}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{
                  backgroundColor: selectedAvatar === avatar ? colors.primary : colors.surface,
                  borderWidth: 2,
                  borderColor: selectedAvatar === avatar ? colors.primary : colors.border,
                }}
              >
                <Text className="text-2xl">{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">
            Your Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={colors.muted}
            className="text-base text-foreground px-4 py-3 rounded-xl"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        {/* Username Input */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-foreground mb-2">
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a unique username"
            placeholderTextColor={colors.muted}
            className="text-base text-foreground px-4 py-3 rounded-xl"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
          <Text className="text-xs text-muted mt-2">
            Letters, numbers, and underscores only
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={isSubmitting}
          className="rounded-xl py-4 items-center mb-8"
          style={{
            backgroundColor: colors.primary,
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <Text className="text-base font-semibold" style={{ color: colors.background }}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
