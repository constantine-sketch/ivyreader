/**
 * AI Reading Concierge - Elite Feature
 * 
 * Personalized AI-powered book recommendations for Elite members.
 */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierGate, TierBadge, UpgradeModal } from "@/components/tier-gate";
import { trpc } from "@/lib/trpc";

// Sample AI recommendations
const AI_RECOMMENDATIONS = [
  {
    id: "1",
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    reason: "Based on your interest in business and philosophy, this book combines wealth-building wisdom with philosophical insights.",
    matchScore: 98,
    category: "Business & Philosophy",
  },
  {
    id: "2",
    title: "The Art of Learning",
    author: "Josh Waitzkin",
    reason: "Your reading patterns show a love for mastery and deep work. This memoir explores the learning process at the highest levels.",
    matchScore: 95,
    category: "Self-Development",
  },
  {
    id: "3",
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    reason: "Given your interest in mental models and decision-making, this book will expand your thinking about uncertainty and risk.",
    matchScore: 92,
    category: "Philosophy",
  },
];

const MOOD_OPTIONS = [
  { id: "inspired", label: "Inspired", emoji: "✨" },
  { id: "curious", label: "Curious", emoji: "🔍" },
  { id: "relaxed", label: "Relaxed", emoji: "😌" },
  { id: "ambitious", label: "Ambitious", emoji: "🚀" },
  { id: "reflective", label: "Reflective", emoji: "🤔" },
];

export default function ConciergeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { accentColor, isDarkTheme, isElite, canAccess } = useTierAccess();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [customRequest, setCustomRequest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for AI indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const hasAccess = canAccess("ai_concierge");

  // Elite-only dark theme
  const bgColor = "#0a0a0a";
  const cardBg = "#151515";
  const borderColor = "#333";
  const goldAccent = "#FFD700";

  if (!hasAccess) {
    return (
      <ScreenContainer containerClassName="bg-[#0a0a0a]">
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
          {/* Locked State */}
          <View className="items-center pt-12">
            <Animated.View
              style={{ transform: [{ scale: pulseAnim }] }}
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
            >
              <View
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{
                  backgroundColor: `${goldAccent}20`,
                  borderWidth: 2,
                  borderColor: goldAccent,
                }}
              >
                <Text style={{ fontSize: 48 }}>🤖</Text>
              </View>
            </Animated.View>

            <Text className="text-3xl font-bold text-center mb-3" style={{ color: "#fff" }}>
              AI Reading Concierge
            </Text>
            <Text className="text-base text-center mb-8" style={{ color: "#888" }}>
              Your personal AI-powered book recommendation engine
            </Text>

            <View
              className="w-full p-6 rounded-2xl mb-6"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: goldAccent }}>
                ELITE EXCLUSIVE FEATURES
              </Text>

              {[
                { icon: "🎯", title: "Personalized Picks", desc: "AI analyzes your reading history" },
                { icon: "💬", title: "Natural Requests", desc: "Ask for books in plain language" },
                { icon: "🧠", title: "Mood Matching", desc: "Get books that match how you feel" },
                { icon: "📊", title: "Match Scores", desc: "See how well each book fits you" },
              ].map((feature, idx) => (
                <View key={idx} className="flex-row items-center mb-4">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: `${goldAccent}20` }}
                  >
                    <Text style={{ fontSize: 20 }}>{feature.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold" style={{ color: "#fff" }}>
                      {feature.title}
                    </Text>
                    <Text className="text-sm" style={{ color: "#888" }}>
                      {feature.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowUpgradeModal(true)}
              className="w-full py-4 rounded-2xl mb-4"
              style={{
                backgroundColor: goldAccent,
                shadowColor: goldAccent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-center font-bold text-lg" style={{ color: "#000" }}>
                Upgrade to Elite
              </Text>
            </TouchableOpacity>

            <Text className="text-center text-sm" style={{ color: "#555" }}>
              Join the Elite tier for $19.99/month
            </Text>
          </View>
        </ScrollView>

        <UpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          targetTier="elite"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-[#0a0a0a]">
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Text style={{ fontSize: 28, marginRight: 8 }}>🤖</Text>
                </Animated.View>
                <Text className="text-3xl font-bold" style={{ color: "#fff" }}>
                  Concierge
                </Text>
              </View>
              <TierBadge size="small" />
            </View>
            <Text className="text-base" style={{ color: "#888" }}>
              Your personal AI reading advisor
            </Text>
          </View>

          {/* Mood Selection */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: goldAccent }}>
              HOW ARE YOU FEELING TODAY?
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {MOOD_OPTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => setSelectedMood(mood.id)}
                  className="mr-3 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: selectedMood === mood.id ? goldAccent : cardBg,
                    borderWidth: 1,
                    borderColor: selectedMood === mood.id ? goldAccent : borderColor,
                  }}
                >
                  <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 4 }}>
                    {mood.emoji}
                  </Text>
                  <Text
                    className="text-sm font-medium"
                    style={{ color: selectedMood === mood.id ? "#000" : "#fff" }}
                  >
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Custom Request */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: goldAccent }}>
              OR ASK FOR SOMETHING SPECIFIC
            </Text>
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <TextInput
                placeholder="e.g., 'A book about stoicism for beginners' or 'Something like Atomic Habits'"
                placeholderTextColor="#555"
                value={customRequest}
                onChangeText={setCustomRequest}
                multiline
                numberOfLines={3}
                style={{
                  color: "#fff",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
              <TouchableOpacity
                onPress={handleGenerateRecommendations}
                disabled={isGenerating}
                className="mt-3 py-3 rounded-xl"
                style={{
                  backgroundColor: isGenerating ? "#333" : goldAccent,
                }}
              >
                {isGenerating ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="ml-2 font-bold" style={{ color: "#fff" }}>
                      Analyzing...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-center font-bold" style={{ color: "#000" }}>
                    Get Recommendations
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Recommendations */}
          <View className="px-6 pb-8">
            <Text className="text-xs font-bold tracking-widest mb-4" style={{ color: goldAccent }}>
              PERSONALIZED FOR YOU
            </Text>

            {AI_RECOMMENDATIONS.map((rec, idx) => (
              <TouchableOpacity
                key={rec.id}
                className="mb-4 rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <View className="p-5">
                  {/* Match Score Badge */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${goldAccent}20` }}
                    >
                      <Text className="text-xs font-medium" style={{ color: goldAccent }}>
                        {rec.category}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 14, marginRight: 4 }}>🎯</Text>
                      <Text className="font-bold" style={{ color: goldAccent }}>
                        {rec.matchScore}% Match
                      </Text>
                    </View>
                  </View>

                  {/* Book Info */}
                  <Text className="text-xl font-bold mb-1" style={{ color: "#fff" }}>
                    {rec.title}
                  </Text>
                  <Text className="text-sm mb-3" style={{ color: "#888" }}>
                    by {rec.author}
                  </Text>

                  {/* AI Reason */}
                  <View
                    className="p-3 rounded-xl mb-4"
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    <View className="flex-row items-start">
                      <Text style={{ fontSize: 16, marginRight: 8 }}>💡</Text>
                      <Text className="flex-1 text-sm leading-5" style={{ color: "#aaa" }}>
                        {rec.reason}
                      </Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    className="py-3 rounded-xl"
                    style={{ backgroundColor: goldAccent }}
                  >
                    <Text className="text-center font-bold" style={{ color: "#000" }}>
                      Add to Library
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}
