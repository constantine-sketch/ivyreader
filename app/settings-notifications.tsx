/**
 * Notifications Settings Screen
 * 
 * Allows users to configure notification preferences.
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";

export default function NotificationsSettingsScreen() {
  const colors = useColors();
  const { accentColor, isDarkTheme } = useTierAccess();
  
  // Notification states
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [goalProgress, setGoalProgress] = useState(true);
  const [communityActivity, setCommunityActivity] = useState(false);
  const [newFeatures, setNewFeatures] = useState(true);
  const [pomodoroReminders, setPomodoroReminders] = useState(true);
  
  // Theme colors
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  
  const SettingRow = ({ 
    title, 
    description, 
    value, 
    onValueChange,
    isLast = false 
  }: { 
    title: string; 
    description: string; 
    value: boolean; 
    onValueChange: (val: boolean) => void;
    isLast?: boolean;
  }) => (
    <View 
      className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b' : ''}`}
      style={{ borderBottomColor: borderColor }}
    >
      <View className="flex-1 mr-4">
        <Text className="font-medium" style={{ color: textColor }}>{title}</Text>
        <Text className="text-sm mt-1" style={{ color: mutedColor }}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: mutedColor, true: accentColor }}
        thumbColor={Platform.OS === 'android' ? (value ? accentColor : '#f4f3f4') : undefined}
        ios_backgroundColor={mutedColor}
      />
    </View>
  );
  
  return (
    <ScreenContainer 
      containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-6 pt-6 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text style={{ color: accentColor, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: textColor }}>
            Notifications
          </Text>
        </View>
        
        {/* Reading Reminders */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            READING REMINDERS
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <SettingRow
              title="Daily Reading Reminder"
              description="Get reminded to read every day at your preferred time"
              value={dailyReminder}
              onValueChange={setDailyReminder}
            />
            <SettingRow
              title="Goal Progress Updates"
              description="Notifications when you're close to reaching your goals"
              value={goalProgress}
              onValueChange={setGoalProgress}
            />
            <SettingRow
              title="Pomodoro Session Reminders"
              description="Reminders for upcoming group reading sessions"
              value={pomodoroReminders}
              onValueChange={setPomodoroReminders}
              isLast
            />
          </View>
        </View>
        
        {/* Community */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            COMMUNITY
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <SettingRow
              title="Community Activity"
              description="Likes, comments, and mentions from other readers"
              value={communityActivity}
              onValueChange={setCommunityActivity}
              isLast
            />
          </View>
        </View>
        
        {/* Updates */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            UPDATES
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <SettingRow
              title="Weekly Reading Digest"
              description="Summary of your reading progress each week"
              value={weeklyDigest}
              onValueChange={setWeeklyDigest}
            />
            <SettingRow
              title="New Features & Tips"
              description="Learn about new features and reading tips"
              value={newFeatures}
              onValueChange={setNewFeatures}
              isLast
            />
          </View>
        </View>
        
        {/* Info */}
        <View className="px-6 mb-8">
          <Text className="text-sm text-center" style={{ color: mutedColor }}>
            You can also manage notifications in your device settings.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
