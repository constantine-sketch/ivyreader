import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const AVATAR_OPTIONS = ["📚", "🎓", "✨", "🌟", "💡", "🔥", "🚀", "🎯", "💎", "👑", "🦋", "🌸"];

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user tier for styling
  const { data: user } = trpc.auth.me.useQuery();
  const isElite = user?.subscriptionTier === "elite";
  const accentColor = isElite ? "#FFD700" : "#D4A574";

  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const utils = trpc.useUtils();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Username Required", "Please enter a username to continue.");
      return;
    }

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

      await utils.auth.me.invalidate();
      router.push("/onboarding/goals");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="flex-1" containerClassName={isElite ? "bg-[#0a0a0a]" : "bg-background"}>
      <ScrollView 
        className="flex-1 px-6"
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
                  backgroundColor: step === 1 ? accentColor : isElite ? "#333" : colors.border 
                }}
              />
            ))}
          </View>

          {/* Header */}
          <View className="mb-8 items-center">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ 
                backgroundColor: `${accentColor}20`,
                borderWidth: 2,
                borderColor: accentColor,
              }}
            >
              <Text style={{ fontSize: 40 }}>{selectedAvatar}</Text>
            </View>
            <Text 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: isElite ? "#fff" : colors.foreground }}
            >
              Create Your Profile
            </Text>
            <Text 
              className="text-base text-center"
              style={{ color: isElite ? "#888" : colors.muted }}
            >
              Let's set up your reading identity
            </Text>
          </View>

          {/* Avatar Selection */}
          <View className="mb-8">
            <Text 
              className="text-xs font-bold tracking-widest mb-4 text-center"
              style={{ color: accentColor }}
            >
              CHOOSE YOUR AVATAR
            </Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  onPress={() => setSelectedAvatar(avatar)}
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: selectedAvatar === avatar 
                      ? `${accentColor}30` 
                      : isElite ? "#1a1a1a" : colors.surface,
                    borderWidth: 2,
                    borderColor: selectedAvatar === avatar ? accentColor : isElite ? "#333" : colors.border,
                  }}
                >
                  <Text className="text-2xl">{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Name Input */}
          <View className="mb-5">
            <Text 
              className="text-sm font-semibold mb-2"
              style={{ color: isElite ? "#fff" : colors.foreground }}
            >
              Your Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={isElite ? "#555" : colors.muted}
              className="text-base px-4 py-4 rounded-xl"
              style={{ 
                backgroundColor: isElite ? "#151515" : colors.surface, 
                borderWidth: 1, 
                borderColor: isElite ? "#333" : colors.border,
                color: isElite ? "#fff" : colors.foreground,
              }}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Username Input */}
          <View className="mb-8">
            <Text 
              className="text-sm font-semibold mb-2"
              style={{ color: isElite ? "#fff" : colors.foreground }}
            >
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a unique username"
              placeholderTextColor={isElite ? "#555" : colors.muted}
              className="text-base px-4 py-4 rounded-xl"
              style={{ 
                backgroundColor: isElite ? "#151515" : colors.surface, 
                borderWidth: 1, 
                borderColor: isElite ? "#333" : colors.border,
                color: isElite ? "#fff" : colors.foreground,
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            <Text 
              className="text-xs mt-2"
              style={{ color: isElite ? "#555" : colors.muted }}
            >
              Letters, numbers, and underscores only
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={isSubmitting}
            className="rounded-2xl py-4 items-center mb-8"
            style={{
              backgroundColor: accentColor,
              opacity: isSubmitting ? 0.6 : 1,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text 
              className="text-base font-bold"
              style={{ color: isElite ? "#000" : "#fff" }}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}
