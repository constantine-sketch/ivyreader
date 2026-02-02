import { View, Text, TouchableOpacity, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useRef } from "react";

const ELITE_PERKS = [
  {
    icon: "👑",
    title: "Personal Reading Concierge",
    description: "Get tailored book recommendations based on your unique reading DNA",
  },
  {
    icon: "🏆",
    title: "Exclusive Challenges",
    description: "Compete in elite-only reading challenges with premium rewards",
  },
  {
    icon: "💎",
    title: "Priority Access",
    description: "Be the first to experience new features before anyone else",
  },
  {
    icon: "🌟",
    title: "VIP Society Status",
    description: "Stand out in the community with your elite badge and privileges",
  },
  {
    icon: "📊",
    title: "Advanced Insights",
    description: "Deep analytics and AI-powered reading pattern analysis",
  },
];

export default function EliteWelcomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const goldColor = "#FFD700";
  const darkBg = "#0a0a0a";

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
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

  return (
    <View className="flex-1" style={{ backgroundColor: darkBg }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          }}
          className="items-center pt-16 px-8"
        >
          {/* Crown Icon */}
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ 
              backgroundColor: `${goldColor}15`,
              borderWidth: 2,
              borderColor: goldColor,
            }}
          >
            <Text style={{ fontSize: 48 }}>👑</Text>
          </View>

          {/* Welcome Text */}
          <Text 
            className="text-sm font-bold tracking-widest mb-2"
            style={{ color: goldColor }}
          >
            WELCOME TO
          </Text>
          <Text 
            className="text-4xl font-bold text-center mb-2"
            style={{ color: "#fff" }}
          >
            The Elite Circle
          </Text>
          <Text 
            className="text-base text-center mb-8 px-4"
            style={{ color: "#888" }}
          >
            You've joined the most exclusive community of dedicated readers
          </Text>

          {/* Decorative divider */}
          <View className="flex-row items-center gap-3 mb-8">
            <View className="h-px w-12" style={{ backgroundColor: goldColor }} />
            <Text style={{ color: goldColor }}>✦</Text>
            <View className="h-px w-12" style={{ backgroundColor: goldColor }} />
          </View>
        </Animated.View>

        {/* Elite Perks */}
        <View className="px-6">
          <Text 
            className="text-xs font-bold tracking-widest mb-4 text-center"
            style={{ color: goldColor }}
          >
            YOUR ELITE PRIVILEGES
          </Text>

          {ELITE_PERKS.map((perk, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20 * (index + 1), 0],
                  }),
                }],
              }}
            >
              <View 
                className="flex-row p-4 rounded-2xl mb-3"
                style={{ 
                  backgroundColor: "#151515",
                  borderWidth: 1,
                  borderColor: `${goldColor}20`,
                }}
              >
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${goldColor}15` }}
                >
                  <Text style={{ fontSize: 24 }}>{perk.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-base font-semibold mb-1"
                    style={{ color: "#fff" }}
                  >
                    {perk.title}
                  </Text>
                  <Text 
                    className="text-sm leading-relaxed"
                    style={{ color: "#777" }}
                  >
                    {perk.description}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA Section */}
        <View className="px-8 mt-8">
          <TouchableOpacity
            onPress={() => router.push("/onboarding/profile")}
            className="w-full rounded-2xl py-4 items-center"
            style={{ 
              backgroundColor: goldColor,
              shadowColor: goldColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="font-bold text-lg" style={{ color: "#000" }}>
              Set Up Your Elite Profile
            </Text>
          </TouchableOpacity>

          <Text 
            className="text-center text-xs mt-4"
            style={{ color: "#555" }}
          >
            Your elite status is active and ready
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
