import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { mockUserStats, formatDuration } from "@/lib/mock-data";

export default function ProfileScreen() {
  const colors = useColors();
  const totalTimeFormatted = formatDuration(mockUserStats.totalTimeInvestedMinutes);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">Profile</Text>
        </View>

        {/* User Info Card */}
        <View className="px-6 mb-6">
          <View className="bg-surface rounded-2xl p-6 border border-border items-center">
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-4xl font-bold" style={{ color: colors.background }}>
                MA
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-1">Marcus A.</Text>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                Top 1% Reader
              </Text>
            </View>
          </View>
        </View>

        {/* Reading Statistics */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Reading Statistics</Text>
          
          <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-muted">Current Streak</Text>
              <Text className="text-lg font-bold text-foreground">{mockUserStats.currentStreak} Days</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-muted">Pages Read (Q4)</Text>
              <Text className="text-lg font-bold text-foreground">{mockUserStats.pagesReadQuarterly.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-muted">Focus Score</Text>
              <Text className="text-lg font-bold text-foreground">{mockUserStats.focusScore}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-muted">Time Invested</Text>
              <Text className="text-lg font-bold text-foreground">{totalTimeFormatted}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted">Percentile Ranking</Text>
              <Text className="text-lg font-bold text-foreground">Top {100 - mockUserStats.percentileRanking}%</Text>
            </View>
          </View>
        </View>

        {/* Reading Goals */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Reading Goals</Text>
          
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row justify-between items-center py-3 border-b border-border">
              <Text className="text-muted">Daily Goal</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-foreground">{mockUserStats.dailyGoalMinutes} min</Text>
                <Pressable>
                  <Text className="text-sm" style={{ color: colors.primary }}>Edit</Text>
                </Pressable>
              </View>
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted">Today's Progress</Text>
              <Text className="text-lg font-bold text-foreground">
                {mockUserStats.todayMinutes} / {mockUserStats.dailyGoalMinutes} min
              </Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Achievements</Text>
          
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">🔥</Text>
              <Text className="text-xs text-center text-muted">12 Day Streak</Text>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">📚</Text>
              <Text className="text-xs text-center text-muted">1K+ Pages</Text>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">⭐</Text>
              <Text className="text-xs text-center text-muted">Top 5%</Text>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">⏱️</Text>
              <Text className="text-xs text-center text-muted">48h+ Reading</Text>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">🎯</Text>
              <Text className="text-xs text-center text-muted">Focus Master</Text>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border items-center" style={{ width: '30%' }}>
              <Text className="text-3xl mb-2">🏆</Text>
              <Text className="text-xs text-center text-muted">Leaderboard</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Settings</Text>
          
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            <Pressable className="flex-row justify-between items-center px-4 py-4 border-b border-border">
              <Text className="text-foreground">Notifications</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
            <Pressable className="flex-row justify-between items-center px-4 py-4 border-b border-border">
              <Text className="text-foreground">Privacy</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
            <Pressable className="flex-row justify-between items-center px-4 py-4 border-b border-border">
              <Text className="text-foreground">Theme</Text>
              <Text className="text-muted">Dark</Text>
            </Pressable>
            <Pressable className="flex-row justify-between items-center px-4 py-4">
              <Text className="text-foreground">About</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="px-6">
          <Pressable 
            className="py-4 rounded-lg border border-border"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-center font-semibold text-error">Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
