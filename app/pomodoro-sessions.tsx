import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function PomodoroSessionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { data: user } = trpc.auth.me.useQuery();
  
  // Check if user is Elite
  const isElite = user?.subscriptionTier === "elite";
  
  // Weekly session schedule
  const sessions = [
    { day: "Monday", time: "7:00 PM EST", duration: "90 min", spots: 12 },
    { day: "Wednesday", time: "7:00 PM EST", duration: "90 min", spots: 12 },
    { day: "Friday", time: "7:00 PM EST", duration: "90 min", spots: 12 },
    { day: "Sunday", time: "3:00 PM EST", duration: "120 min", spots: 15 },
  ];
  
  const handleJoinSession = (day: string) => {
    // In production, this would open the actual meeting link
    alert(`Joining ${day} Pomodoro session...`);
  };

  if (!isElite) {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1 px-6 pt-4">
          {/* Header */}
          <Pressable
            onPress={() => router.back()}
            className="mb-4"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-base" style={{ color: colors.primary }}>
              ← Back
            </Text>
          </Pressable>
          
          {/* Locked State */}
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-6xl mb-4">🔒</Text>
            <Text className="text-2xl font-bold text-foreground mb-3 text-center">
              Elite Feature
            </Text>
            <Text className="text-base text-muted text-center mb-6 px-4">
              Weekly Pomodoro sessions are exclusive to Elite members. Upgrade to join focused reading sessions with fellow readers.
            </Text>
            <Pressable
              onPress={() => router.push('/subscription')}
              className="px-8 py-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-bold" style={{ color: colors.background }}>
                Upgrade to Elite
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          className="mb-4"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text className="text-base" style={{ color: colors.primary }}>
            ← Back
          </Text>
        </Pressable>
        
        <Text className="text-3xl font-bold text-foreground mb-2">
          Weekly Pomodoro Sessions
        </Text>
        <Text className="text-base text-muted mb-6">
          Join focused reading sessions with fellow Elite members. We read together in 25-minute blocks with 5-minute breaks.
        </Text>
        
        {/* How It Works */}
        <View className="rounded-2xl p-5 mb-6" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-bold text-foreground mb-3">
            How It Works
          </Text>
          <View className="gap-3">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">📚</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  Bring Your Book
                </Text>
                <Text className="text-xs text-muted">
                  Read any book you're currently working through
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">⏱️</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  25-Minute Sprints
                </Text>
                <Text className="text-xs text-muted">
                  Focused reading with cameras on for accountability
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">☕</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  5-Minute Breaks
                </Text>
                <Text className="text-xs text-muted">
                  Chat, share insights, or just stretch
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">🎯</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  Track Progress
                </Text>
                <Text className="text-xs text-muted">
                  Log your pages read after each session
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Session Schedule */}
        <Text className="text-xl font-bold text-foreground mb-3">
          This Week's Schedule
        </Text>
        <View className="gap-3 mb-6">
          {sessions.map((session, index) => (
            <View
              key={index}
              className="rounded-2xl p-5 border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border
              }}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-1">
                    {session.day}
                  </Text>
                  <Text className="text-sm text-muted">
                    {session.time} • {session.duration}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted mb-1">
                    {session.spots} spots
                  </Text>
                  <View 
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: colors.success + "20" }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                      Open
                    </Text>
                  </View>
                </View>
              </View>
              
              <Pressable
                onPress={() => handleJoinSession(session.day)}
                className="py-3 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="font-bold" style={{ color: colors.background }}>
                  Join Session
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
        
        {/* Community Guidelines */}
        <View className="rounded-2xl p-5 mb-6" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-bold text-foreground mb-3">
            Community Guidelines
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            • Keep your camera on during reading sprints{"\n"}
            • Mute yourself during focus time{"\n"}
            • Be respectful and encouraging{"\n"}
            • Share book recommendations during breaks{"\n"}
            • No spoilers without warnings!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
