/**
 * Edit Profile Screen
 * 
 * Allows users to update their name, username, and avatar.
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTierAccess } from "@/hooks/use-tier-access";

const AVATAR_OPTIONS = [
  "📚", "📖", "📕", "📗", "📘", "📙", "🎓", "🦉", "🌟", "✨",
  "🌙", "☀️", "🌈", "🎯", "💡", "🔥", "💎", "🏆", "👑", "🎨"
];

export default function EditProfileScreen() {
  const colors = useColors();
  const { data: user, refetch } = trpc.auth.me.useQuery();
  const { accentColor, isDarkTheme } = useTierAccess();
  const utils = trpc.useUtils();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme colors
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setAvatar(user.avatar || "📚");
    }
  }, [user]);
  
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setIsSaving(false);
      if (Platform.OS === 'web') {
        alert('Profile updated successfully!');
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
      }
      router.back();
    },
    onError: (error) => {
      setIsSaving(false);
      if (Platform.OS === 'web') {
        alert('Failed to update profile: ' + error.message);
      } else {
        Alert.alert('Error', 'Failed to update profile: ' + error.message);
      }
    },
  });
  
  const handleSave = () => {
    if (!name.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter your name');
      } else {
        Alert.alert('Error', 'Please enter your name');
      }
      return;
    }
    
    setIsSaving(true);
    updateProfile.mutate({
      name: name.trim(),
      username: username.trim() || undefined,
      avatar: avatar,
    });
  };
  
  return (
    <ScreenContainer 
      containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: accentColor, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: textColor }}>
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color={accentColor} />
            ) : (
              <Text style={{ color: accentColor, fontSize: 16, fontWeight: '600' }}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Avatar Selection */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold mb-3" style={{ color: mutedColor }}>
            AVATAR
          </Text>
          <View 
            className="rounded-2xl p-4"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            {/* Current Avatar */}
            <View className="items-center mb-4">
              <View 
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{ backgroundColor: `${accentColor}20`, borderWidth: 2, borderColor: accentColor }}
              >
                <Text style={{ fontSize: 48 }}>{avatar}</Text>
              </View>
            </View>
            
            {/* Avatar Options */}
            <View className="flex-row flex-wrap justify-center gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setAvatar(emoji)}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: avatar === emoji ? `${accentColor}30` : `${mutedColor}20`,
                    borderWidth: avatar === emoji ? 2 : 0,
                    borderColor: accentColor,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Name Input */}
        <View className="px-6 mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: mutedColor }}>
            NAME
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={mutedColor}
            className="px-4 py-4 rounded-xl"
            style={{
              backgroundColor: cardBg,
              color: textColor,
              borderWidth: 1,
              borderColor,
              fontSize: 16,
            }}
          />
        </View>
        
        {/* Username Input */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold mb-2" style={{ color: mutedColor }}>
            USERNAME
          </Text>
          <View className="flex-row items-center">
            <Text 
              className="px-4 py-4 rounded-l-xl"
              style={{ 
                backgroundColor: isDarkTheme ? "#1a1a1a" : colors.border,
                color: mutedColor,
                fontSize: 16,
              }}
            >
              @
            </Text>
            <TextInput
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="username"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              className="flex-1 px-4 py-4 rounded-r-xl"
              style={{
                backgroundColor: cardBg,
                color: textColor,
                borderWidth: 1,
                borderLeftWidth: 0,
                borderColor,
                fontSize: 16,
              }}
            />
          </View>
          <Text className="text-xs mt-2" style={{ color: mutedColor }}>
            Only lowercase letters, numbers, and underscores
          </Text>
        </View>
        
        
      </ScrollView>
    </ScreenContainer>
  );
}
