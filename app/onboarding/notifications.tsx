import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Notifications from "expo-notifications";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function NotificationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const updateOnboardingMutation = trpc.user.updateOnboarding.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === "web") {
      setPermissionStatus("granted");
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermissions = async () => {
    if (Platform.OS === "web") {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status === "granted";
  };

  const handleComplete = async () => {
    let finalNotificationsEnabled = notificationsEnabled;

    if (notificationsEnabled && Platform.OS !== "web") {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          "Notifications Disabled",
          "You can enable notifications later in your profile settings.",
          [{ text: "OK" }]
        );
        finalNotificationsEnabled = false;
      }
    }

    try {
      // Parse params
      const pagesPerWeek = params.pagesPerWeek ? parseInt(params.pagesPerWeek as string) : undefined;
      const genres = params.genres ? JSON.parse(params.genres as string) : [];

      // Save onboarding data
      await updateOnboardingMutation.mutateAsync({
        onboardingCompleted: true,
        readingGoalPagesPerWeek: pagesPerWeek,
        favoriteGenres: genres.length > 0 ? JSON.stringify(genres) : undefined,
        notificationsEnabled: finalNotificationsEnabled,
      });

      // Invalidate user query to refresh auth state with updated onboarding status
      await utils.auth.me.invalidate();

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      Alert.alert("Error", "Failed to save your preferences. Please try again.");
    }
  };

  return (
    <ScreenContainer className="flex-1 justify-between px-6">
      <View className="flex-1 justify-center">
        {/* Progress Indicator */}
        <View className="flex-row gap-2 mb-12">
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
        </View>

        {/* Icon */}
        <View className="items-center mb-6">
          <Text style={{ fontSize: 80 }}>🔔</Text>
        </View>

        {/* Header */}
        <Text className="text-3xl font-bold text-foreground text-center mb-3">
          Stay on Track
        </Text>
        <Text className="text-base text-muted text-center mb-8 leading-relaxed">
          Get reminders to read, updates on your progress, and notifications when friends interact with your posts
        </Text>

        {/* Notification Options */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            onPress={() => setNotificationsEnabled(true)}
            className="flex-row items-center p-4 rounded-xl border-2"
            style={{
              borderColor: notificationsEnabled ? colors.primary : colors.border,
              backgroundColor: notificationsEnabled ? `${colors.primary}10` : "transparent",
            }}
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground mb-1">
                Enable Notifications
              </Text>
              <Text className="text-sm text-muted">
                Get reading reminders and social updates
              </Text>
            </View>
            <View
              className="w-6 h-6 rounded-full border-2 items-center justify-center"
              style={{ borderColor: colors.primary }}
            >
              {notificationsEnabled && (
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setNotificationsEnabled(false)}
            className="flex-row items-center p-4 rounded-xl border-2"
            style={{
              borderColor: !notificationsEnabled ? colors.primary : colors.border,
              backgroundColor: !notificationsEnabled ? `${colors.primary}10` : "transparent",
            }}
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground mb-1">
                Not Now
              </Text>
              <Text className="text-sm text-muted">
                You can enable this later in settings
              </Text>
            </View>
            <View
              className="w-6 h-6 rounded-full border-2 items-center justify-center"
              style={{ borderColor: colors.primary }}
            >
              {!notificationsEnabled && (
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Complete Button */}
      <View className="pb-8">
        <TouchableOpacity
          onPress={handleComplete}
          className="w-full rounded-full py-4 px-8"
          style={{ backgroundColor: colors.primary }}
          disabled={updateOnboardingMutation.isPending}
        >
          <Text className="text-center font-semibold text-lg" style={{ color: colors.background }}>
            {updateOnboardingMutation.isPending ? "Setting up..." : "Get Started"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
