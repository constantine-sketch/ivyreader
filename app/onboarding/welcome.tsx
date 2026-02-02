import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
// Animations handled with native Animated API

// Premium tier content
const PREMIUM_CONTENT = {
  title: "Welcome to",
  brandName: "IvyReader",
  subtitle: "Your premium reading companion awaits",
  features: [
    { emoji: "📚", title: "Unlimited Library", desc: "Track every book in your collection" },
    { emoji: "📋", title: "Curated Lists", desc: "Handpicked reading recommendations" },
    { emoji: "👥", title: "Reader Society", desc: "Connect with fellow bibliophiles" },
    { emoji: "📈", title: "Smart Analytics", desc: "Insights into your reading habits" },
  ],
  buttonText: "Begin Your Journey",
  accentColor: "#D4A574", // Warm gold/tan
};

// Elite tier content
const ELITE_CONTENT = {
  title: "Welcome to the",
  brandName: "Elite Circle",
  subtitle: "You've unlocked the ultimate reading experience",
  features: [
    { emoji: "👑", title: "VIP Access", desc: "Everything Premium, elevated" },
    { emoji: "🏆", title: "Exclusive Challenges", desc: "Compete in elite reading events" },
    { emoji: "💎", title: "Priority Features", desc: "First access to new capabilities" },
    { emoji: "🎓", title: "Personal Concierge", desc: "Tailored recommendations just for you" },
  ],
  buttonText: "Enter the Circle",
  accentColor: "#FFD700", // Gold
};

export default function WelcomeScreen() {
  const router = useRouter();
  const colors = useColors();
  
  // Get user's subscription tier from database
  const { data: user } = trpc.auth.me.useQuery();
  const tier = user?.subscriptionTier || "premium";
  const isElite = tier === "elite";
  const content = isElite ? ELITE_CONTENT : PREMIUM_CONTENT;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    if (isElite) {
      router.push("/onboarding/elite-welcome");
    } else {
      router.push("/onboarding/profile");
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1 px-8 pt-12 pb-8">
        {/* Top Section with Badge */}
        <Animated.View 
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="items-center"
        >
          {/* Tier Badge */}
          <View 
            className="px-5 py-2 rounded-full mb-8"
            style={{ 
              backgroundColor: isElite ? "#1a1a1a" : `${content.accentColor}20`,
              borderWidth: isElite ? 1 : 0,
              borderColor: content.accentColor,
            }}
          >
            <Text 
              className="text-sm font-bold tracking-widest"
              style={{ color: content.accentColor }}
            >
              {isElite ? "✦ ELITE MEMBER ✦" : "★ PREMIUM"}
            </Text>
          </View>

          {/* Main Title */}
          <Text className="text-lg text-muted mb-1">
            {content.title}
          </Text>
          <Text 
            className="text-4xl font-bold text-center mb-3"
            style={{ color: isElite ? content.accentColor : colors.foreground }}
          >
            {content.brandName}
          </Text>
          <Text className="text-base text-muted text-center mb-8">
            {content.subtitle}
          </Text>

          {/* Decorative Line */}
          <View 
            className="w-16 h-0.5 rounded-full mb-8"
            style={{ backgroundColor: content.accentColor }}
          />
        </Animated.View>

        {/* Features Grid */}
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="flex-1 justify-center"
        >
          <View className="gap-4">
            {content.features.map((feature, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, index % 2 === 0 ? -20 : 20],
                    }),
                  }],
                }}
              >
                <View 
                  className="flex-row items-center p-4 rounded-2xl"
                  style={{ 
                    backgroundColor: isElite ? "#1a1a1a" : colors.surface,
                    borderWidth: isElite ? 1 : 0,
                    borderColor: `${content.accentColor}30`,
                  }}
                >
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${content.accentColor}20` }}
                  >
                    <Text style={{ fontSize: 24 }}>{feature.emoji}</Text>
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="text-base font-semibold mb-0.5"
                      style={{ color: isElite ? "#fff" : colors.foreground }}
                    >
                      {feature.title}
                    </Text>
                    <Text 
                      className="text-sm"
                      style={{ color: isElite ? "#999" : colors.muted }}
                    >
                      {feature.desc}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom CTA */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            onPress={handleGetStarted}
            className="w-full rounded-2xl py-4 px-8 items-center"
            style={{ 
              backgroundColor: content.accentColor,
              shadowColor: content.accentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text 
              className="font-bold text-lg"
              style={{ color: isElite ? "#000" : "#fff" }}
            >
              {content.buttonText}
            </Text>
          </TouchableOpacity>

          {/* Skip for now - subtle */}
          <TouchableOpacity
            onPress={() => router.push("/onboarding/profile")}
            className="mt-4 py-2"
          >
            <Text className="text-center text-sm text-muted">
              Skip introduction
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}
