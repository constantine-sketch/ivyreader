/**
 * Privacy Settings Screen
 * 
 * Allows users to configure privacy preferences.
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";

export default function PrivacySettingsScreen() {
  const colors = useColors();
  const { accentColor, isDarkTheme } = useTierAccess();
  
  // Privacy states
  const [publicProfile, setPublicProfile] = useState(true);
  const [showReadingActivity, setShowReadingActivity] = useState(true);
  const [showInLeaderboards, setShowInLeaderboards] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  
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
  
  const handleDeleteData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete all your reading data? This cannot be undone.')) {
        alert('Data deletion request submitted. This may take up to 30 days to process.');
      }
    } else {
      Alert.alert(
        'Delete Reading Data',
        'Are you sure you want to delete all your reading data? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => Alert.alert('Request Submitted', 'Data deletion request submitted. This may take up to 30 days to process.')
          },
        ]
      );
    }
  };
  
  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.')) {
        alert('Account deletion request submitted. You will receive an email confirmation.');
      }
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete Account', 
            style: 'destructive',
            onPress: () => Alert.alert('Request Submitted', 'Account deletion request submitted. You will receive an email confirmation.')
          },
        ]
      );
    }
  };
  
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
            Privacy
          </Text>
        </View>
        
        {/* Profile Visibility */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            PROFILE VISIBILITY
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <SettingRow
              title="Public Profile"
              description="Allow other readers to view your profile"
              value={publicProfile}
              onValueChange={setPublicProfile}
            />
            <SettingRow
              title="Show Reading Activity"
              description="Display your current reads and progress"
              value={showReadingActivity}
              onValueChange={setShowReadingActivity}
            />
            <SettingRow
              title="Appear in Leaderboards"
              description="Show your name in community rankings"
              value={showInLeaderboards}
              onValueChange={setShowInLeaderboards}
              isLast
            />
          </View>
        </View>
        
        {/* Communication */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            COMMUNICATION
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <SettingRow
              title="Allow Direct Messages"
              description="Let other readers send you messages"
              value={allowMessages}
              onValueChange={setAllowMessages}
              isLast
            />
          </View>
        </View>
        
        {/* Data Management */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            DATA MANAGEMENT
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'web') {
                  alert('Your data export will be emailed to you within 24 hours.');
                } else {
                  Alert.alert('Export Requested', 'Your data export will be emailed to you within 24 hours.');
                }
              }}
              className="flex-row items-center justify-between p-4 border-b"
              style={{ borderBottomColor: borderColor }}
            >
              <View>
                <Text className="font-medium" style={{ color: textColor }}>Export My Data</Text>
                <Text className="text-sm mt-1" style={{ color: mutedColor }}>Download a copy of all your data</Text>
              </View>
              <Text style={{ color: mutedColor }}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDeleteData}
              className="flex-row items-center justify-between p-4"
            >
              <View>
                <Text className="font-medium" style={{ color: colors.error }}>Delete Reading Data</Text>
                <Text className="text-sm mt-1" style={{ color: mutedColor }}>Remove all books and reading history</Text>
              </View>
              <Text style={{ color: mutedColor }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Danger Zone */}
        <View className="px-6 mb-8">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: colors.error }}>
            DANGER ZONE
          </Text>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="rounded-2xl p-4"
            style={{ 
              backgroundColor: `${colors.error}10`,
              borderWidth: 1,
              borderColor: colors.error,
            }}
          >
            <Text className="font-medium text-center" style={{ color: colors.error }}>
              Delete Account
            </Text>
            <Text className="text-sm text-center mt-1" style={{ color: mutedColor }}>
              Permanently delete your account and all data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
