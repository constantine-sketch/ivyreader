/**
 * Subscription Management Page
 * 
 * View current plan, billing history, and upgrade/downgrade options.
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Platform, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTierAccess } from "@/hooks/use-tier-access";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Mock billing history
const BILLING_HISTORY = [
  { id: "1", date: "Jan 15, 2026", amount: 9.99, status: "Paid", plan: "Premium" },
  { id: "2", date: "Dec 15, 2025", amount: 9.99, status: "Paid", plan: "Premium" },
  { id: "3", date: "Nov 15, 2025", amount: 9.99, status: "Paid", plan: "Premium" },
];

const PREMIUM_FEATURES = [
  { icon: "📚", name: "Unlimited Library", description: "Add unlimited books" },
  { icon: "📋", name: "Curated Reading Lists", description: "Expert-curated collections" },
  { icon: "👥", name: "Reader Society", description: "Community access" },
  { icon: "💡", name: "Reading Insights", description: "Personalized analytics" },
  { icon: "📤", name: "Export Data", description: "Download your data" },
];

const ELITE_FEATURES = [
  { icon: "🤖", name: "AI Reading Concierge", description: "Personalized recommendations" },
  { icon: "🔬", name: "Advanced Analytics", description: "Deep reading insights" },
  { icon: "👑", name: "Elite Badge", description: "Exclusive status" },
  { icon: "⚡", name: "Priority Support", description: "Faster responses" },
  { icon: "🏆", name: "Exclusive Challenges", description: "Elite-only events" },
  { icon: "🎯", name: "Pomodoro Group Calls", description: "Live focus sessions" },
  { icon: "💬", name: "Founder Access", description: "Direct chat with founders" },
  { icon: "🤝", name: "Accountability Partner", description: "Matched reading buddy" },
];

export default function SubscriptionScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const { tier, tierInfo, accentColor, isDarkTheme, isElite, isPremiumOrHigher } = useTierAccess();
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Theme colors
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  const goldAccent = "#FFD700";
  const premiumAccent = "#D4A574";

  const handleUpgrade = (targetTier: string) => {
    if (Platform.OS === 'web') {
      window.open(`https://ivyreader.com/checkout?tier=${targetTier}`, '_blank');
    } else {
      import('expo-web-browser').then(WebBrowser => {
        WebBrowser.openBrowserAsync(`https://ivyreader.com/checkout?tier=${targetTier}`);
      });
    }
  };

  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-2">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="flex-row items-center mb-4"
            >
              <IconSymbol name="chevron.left" size={20} color={accentColor} />
              <Text style={{ color: accentColor, fontSize: 16, marginLeft: 4 }}>Back</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold" style={{ color: textColor }}>
              Subscription
            </Text>
            <Text className="text-base mt-1" style={{ color: mutedColor }}>
              Manage your plan and billing
            </Text>
          </View>

          {/* Current Plan Card */}
          <View className="px-6 mt-6">
            <View 
              className="rounded-2xl p-6"
              style={{
                backgroundColor: isElite ? `${goldAccent}10` : `${premiumAccent}10`,
                borderWidth: 2,
                borderColor: isElite ? goldAccent : premiumAccent,
              }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-xs font-bold tracking-widest mb-1" style={{ color: mutedColor }}>
                    CURRENT PLAN
                  </Text>
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 28, marginRight: 8 }}>{tierInfo.icon}</Text>
                    <Text className="text-2xl font-bold" style={{ color: textColor }}>
                      {tierInfo.name}
                    </Text>
                  </View>
                </View>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: isElite ? goldAccent : premiumAccent }}
                >
                  <Text className="text-xs font-bold" style={{ color: isElite ? "#000" : "#fff" }}>
                    ACTIVE
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-baseline mb-4">
                <Text className="text-4xl font-bold" style={{ color: textColor }}>
                  ${tierInfo.monthlyPrice}
                </Text>
                <Text className="text-base ml-1" style={{ color: mutedColor }}>
                  /month
                </Text>
              </View>
              
              <Text className="text-sm" style={{ color: mutedColor }}>
                Next billing date: February 15, 2026
              </Text>
            </View>
          </View>

          {/* Upgrade to Elite (for Premium users) */}
          {isPremiumOrHigher && !isElite && (
            <View className="px-6 mt-8">
              <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: goldAccent }}>
                UPGRADE TO ELITE
              </Text>
              
              <TouchableOpacity
                onPress={() => handleUpgrade("elite")}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 2,
                  borderColor: goldAccent,
                }}
              >
                <View className="flex-row items-center mb-4">
                  <Text style={{ fontSize: 32, marginRight: 12 }}>👑</Text>
                  <View className="flex-1">
                    <Text className="text-xl font-bold" style={{ color: textColor }}>
                      Elite Membership
                    </Text>
                    <View className="flex-row items-baseline">
                      <Text className="text-2xl font-bold" style={{ color: goldAccent }}>
                        $19.99
                      </Text>
                      <Text className="text-sm ml-1" style={{ color: mutedColor }}>
                        /month
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View className="mb-4">
                  {ELITE_FEATURES.slice(0, 4).map((feature, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <Text style={{ fontSize: 16, marginRight: 8 }}>{feature.icon}</Text>
                      <Text className="text-sm" style={{ color: textColor }}>
                        {feature.name}
                      </Text>
                    </View>
                  ))}
                  <Text className="text-sm" style={{ color: goldAccent }}>
                    + {ELITE_FEATURES.length - 4} more features
                  </Text>
                </View>
                
                <View 
                  className="py-3 rounded-xl items-center"
                  style={{ backgroundColor: goldAccent }}
                >
                  <Text className="font-bold text-base" style={{ color: "#000" }}>
                    Upgrade to Elite
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Plan Comparison */}
          <View className="px-6 mt-8">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: accentColor }}>
              PLAN COMPARISON
            </Text>
            
            <View 
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              {/* Premium Column */}
              <View className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 20, marginRight: 8 }}>⭐</Text>
                    <Text className="text-lg font-bold" style={{ color: textColor }}>Premium</Text>
                  </View>
                  <Text className="font-bold" style={{ color: premiumAccent }}>$9.99/mo</Text>
                </View>
                {PREMIUM_FEATURES.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <Text style={{ color: colors.success, marginRight: 8 }}>✓</Text>
                    <Text className="text-sm" style={{ color: textColor }}>{feature.name}</Text>
                  </View>
                ))}
              </View>
              
              {/* Elite Column */}
              <View className="p-4" style={{ backgroundColor: isDarkTheme ? "#1a1a1a" : `${goldAccent}05` }}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 20, marginRight: 8 }}>👑</Text>
                    <Text className="text-lg font-bold" style={{ color: textColor }}>Elite</Text>
                  </View>
                  <Text className="font-bold" style={{ color: goldAccent }}>$19.99/mo</Text>
                </View>
                <Text className="text-xs mb-3" style={{ color: mutedColor }}>
                  Everything in Premium, plus:
                </Text>
                {ELITE_FEATURES.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <Text style={{ color: goldAccent, marginRight: 8 }}>✓</Text>
                    <Text className="text-sm" style={{ color: textColor }}>{feature.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Billing History */}
          <View className="px-6 mt-8 mb-4">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: accentColor }}>
              BILLING HISTORY
            </Text>
            
            <View 
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              {BILLING_HISTORY.map((item, index) => (
                <View 
                  key={item.id}
                  className="flex-row items-center justify-between p-4"
                  style={{
                    borderBottomWidth: index < BILLING_HISTORY.length - 1 ? 1 : 0,
                    borderBottomColor: borderColor,
                  }}
                >
                  <View>
                    <Text className="font-medium" style={{ color: textColor }}>{item.date}</Text>
                    <Text className="text-sm" style={{ color: mutedColor }}>{item.plan} Plan</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold" style={{ color: textColor }}>${item.amount}</Text>
                    <View 
                      className="px-2 py-0.5 rounded mt-1"
                      style={{ backgroundColor: `${colors.success}20` }}
                    >
                      <Text className="text-xs" style={{ color: colors.success }}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity className="mt-4 items-center">
              <Text className="text-sm" style={{ color: accentColor }}>
                View Full Billing History →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Account Management */}
          <View className="px-6 mb-8">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: accentColor }}>
              ACCOUNT MANAGEMENT
            </Text>
            
            <View 
              className="rounded-2xl"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Pressable 
                onPress={() => Alert.alert("Coming Soon", "Payment method management will be available soon.")}
                className="flex-row items-center justify-between p-4 border-b" 
                style={({ pressed }) => [{ borderBottomColor: borderColor, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={{ color: textColor }}>Update Payment Method</Text>
                <Text style={{ color: mutedColor }}>›</Text>
              </Pressable>
              <Pressable 
                onPress={() => Alert.alert("Coming Soon", "Invoice downloads will be available soon.")}
                className="flex-row items-center justify-between p-4 border-b" 
                style={({ pressed }) => [{ borderBottomColor: borderColor, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={{ color: textColor }}>Download Invoices</Text>
                <Text style={{ color: mutedColor }}>›</Text>
              </Pressable>
              <Pressable 
                onPress={() => Alert.alert("Cancel Subscription", "Please contact support to cancel your subscription.")}
                className="flex-row items-center justify-between p-4"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={{ color: colors.error }}>Cancel Subscription</Text>
                <Text style={{ color: mutedColor }}>›</Text>
              </Pressable>
            </View>
          </View>

          {/* Support Note */}
          <View className="px-6 mb-8">
            <View 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <Text className="text-sm text-center" style={{ color: mutedColor }}>
                Need help? Contact us at support@ivyreader.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}
