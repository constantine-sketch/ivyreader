import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Platform, Alert, Animated } from "react-native";
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
  const [isCompleting, setIsCompleting] = useState(false);

  // Get user tier for styling
  const { data: user } = trpc.auth.me.useQuery();
  const isElite = user?.subscriptionTier === "elite";
  const accentColor = isElite ? "#FFD700" : "#D4A574";

  const updateOnboardingMutation = trpc.user.updateOnboarding.useMutation();
  const utils = trpc.useUtils();

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    checkPermissions();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
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
    if (Platform.OS === "web") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status === "granted";
  };

  const handleComplete = async () => {
    setIsCompleting(true);
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
      const pagesPerWeek = params.pagesPerWeek ? parseInt(params.pagesPerWeek as string) : undefined;
      const genres = params.genres ? JSON.parse(params.genres as string) : [];

      await updateOnboardingMutation.mutateAsync({
        onboardingCompleted: true,
        readingGoalPagesPerWeek: pagesPerWeek,
        favoriteGenres: genres.length > 0 ? JSON.stringify(genres) : undefined,
        notificationsEnabled: finalNotificationsEnabled,
      });

      await utils.auth.me.invalidate();
      const refetchResult = await utils.auth.me.fetch();
      
      if (refetchResult?.onboardingCompleted) {
        router.replace("/(tabs)");
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      Alert.alert("Error", "Failed to save your preferences. Please try again.");
      setIsCompleting(false);
    }
  };

  return (
    <ScreenContainer 
      className="flex-1 justify-between px-6"
      containerClassName={isElite ? "bg-[#0a0a0a]" : "bg-background"}
    >
      <Animated.View 
        className="flex-1 justify-center"
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        {/* Progress Indicator */}
        <View className="flex-row gap-2 mb-12">
          {[1, 2, 3, 4].map((step) => (
            <View 
              key={step}
              className="flex-1 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          ))}
        </View>

        {/* Icon */}
        <View className="items-center mb-6">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center"
            style={{ 
              backgroundColor: `${accentColor}20`,
              borderWidth: 2,
              borderColor: accentColor,
            }}
          >
            <Text style={{ fontSize: 48 }}>🔔</Text>
          </View>
        </View>

        {/* Header */}
        <Text 
          className="text-3xl font-bold text-center mb-3"
          style={{ color: isElite ? "#fff" : colors.foreground }}
        >
          Stay on Track
        </Text>
        <Text 
          className="text-base text-center mb-8 leading-relaxed px-4"
          style={{ color: isElite ? "#888" : colors.muted }}
        >
          Get reminders to read, updates on your progress, and notifications when friends interact with your posts
        </Text>

        {/* Notification Options */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            onPress={() => setNotificationsEnabled(true)}
            className="flex-row items-center p-5 rounded-2xl"
            style={{
              backgroundColor: notificationsEnabled 
                ? `${accentColor}20` 
                : isElite ? "#151515" : colors.surface,
              borderWidth: 2,
              borderColor: notificationsEnabled ? accentColor : isElite ? "#333" : colors.border,
            }}
          >
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Text style={{ fontSize: 24 }}>✅</Text>
            </View>
            <View className="flex-1">
              <Text 
                className="text-lg font-semibold mb-1"
                style={{ color: isElite ? "#fff" : colors.foreground }}
              >
                Enable Notifications
              </Text>
              <Text 
                className="text-sm"
                style={{ color: isElite ? "#888" : colors.muted }}
              >
                Get reading reminders and social updates
              </Text>
            </View>
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: notificationsEnabled ? accentColor : "transparent",
                borderWidth: 2,
                borderColor: accentColor,
              }}
            >
              {notificationsEnabled && (
                <Text style={{ color: isElite ? "#000" : "#fff", fontSize: 12 }}>✓</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setNotificationsEnabled(false)}
            className="flex-row items-center p-5 rounded-2xl"
            style={{
              backgroundColor: !notificationsEnabled 
                ? `${accentColor}20` 
                : isElite ? "#151515" : colors.surface,
              borderWidth: 2,
              borderColor: !notificationsEnabled ? accentColor : isElite ? "#333" : colors.border,
            }}
          >
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: isElite ? "#222" : colors.border }}
            >
              <Text style={{ fontSize: 24 }}>🔕</Text>
            </View>
            <View className="flex-1">
              <Text 
                className="text-lg font-semibold mb-1"
                style={{ color: isElite ? "#fff" : colors.foreground }}
              >
                Not Now
              </Text>
              <Text 
                className="text-sm"
                style={{ color: isElite ? "#888" : colors.muted }}
              >
                You can enable this later in settings
              </Text>
            </View>
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: !notificationsEnabled ? accentColor : "transparent",
                borderWidth: 2,
                borderColor: accentColor,
              }}
            >
              {!notificationsEnabled && (
                <Text style={{ color: isElite ? "#000" : "#fff", fontSize: 12 }}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Complete Button */}
      <View className="pb-8">
        <TouchableOpacity
          onPress={handleComplete}
          className="w-full rounded-2xl py-4 px-8"
          style={{ 
            backgroundColor: accentColor,
            opacity: isCompleting ? 0.7 : 1,
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          disabled={isCompleting}
        >
          <Text 
            className="text-center font-bold text-lg"
            style={{ color: isElite ? "#000" : "#fff" }}
          >
            {isCompleting ? "Setting up your account..." : "Complete Setup"}
          </Text>
        </TouchableOpacity>

        {isElite && (
          <Text 
            className="text-center text-xs mt-4"
            style={{ color: "#555" }}
          >
            Your Elite membership is now active
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}
