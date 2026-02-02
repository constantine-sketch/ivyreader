/**
 * About IvyReader Screen
 * 
 * Information about the app, version, and links.
 */

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Linking } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess } from "@/hooks/use-tier-access";

const APP_VERSION = "1.0.0";
const BUILD_NUMBER = "1";

export default function AboutScreen() {
  const colors = useColors();
  const { accentColor, isDarkTheme } = useTierAccess();
  
  // Theme colors
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  const goldAccent = "#FFD700";
  
  const openLink = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };
  
  const LinkRow = ({ title, url, isLast = false }: { title: string; url: string; isLast?: boolean }) => (
    <TouchableOpacity
      onPress={() => openLink(url)}
      className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b' : ''}`}
      style={{ borderBottomColor: borderColor }}
    >
      <Text style={{ color: textColor }}>{title}</Text>
      <Text style={{ color: mutedColor }}>›</Text>
    </TouchableOpacity>
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
            About
          </Text>
        </View>
        
        {/* App Info */}
        <View className="items-center py-8">
          <View 
            className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Text style={{ fontSize: 48 }}>📚</Text>
          </View>
          <Text className="text-2xl font-bold" style={{ color: textColor }}>
            IvyReader
          </Text>
          <Text className="text-sm mt-1" style={{ color: mutedColor }}>
            Version {APP_VERSION} ({BUILD_NUMBER})
          </Text>
        </View>
        
        {/* Mission */}
        <View className="px-6 mb-6">
          <View 
            className="rounded-2xl p-5"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <Text className="text-lg font-bold mb-2" style={{ color: textColor }}>
              Our Mission
            </Text>
            <Text className="leading-6" style={{ color: mutedColor }}>
              IvyReader helps ambitious readers build consistent reading habits, 
              track their progress, and connect with a community of like-minded individuals. 
              We believe that reading is the foundation of personal and professional growth.
            </Text>
          </View>
        </View>
        
        {/* Links */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            RESOURCES
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <LinkRow title="Website" url="https://ivyreader.com" />
            <LinkRow title="Help Center" url="https://help.ivyreader.com" />
            <LinkRow title="Terms of Service" url="https://ivyreader.com/terms" />
            <LinkRow title="Privacy Policy" url="https://ivyreader.com/privacy" isLast />
          </View>
        </View>
        
        {/* Social */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
            CONNECT WITH US
          </Text>
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <LinkRow title="Twitter / X" url="https://twitter.com/ivyreader" />
            <LinkRow title="Instagram" url="https://instagram.com/ivyreader" />
            <LinkRow title="Contact Support" url="mailto:support@ivyreader.com" isLast />
          </View>
        </View>
        
        {/* Credits */}
        <View className="px-6 mb-8">
          <View 
            className="rounded-2xl p-5 items-center"
            style={{ backgroundColor: `${goldAccent}10`, borderWidth: 1, borderColor: goldAccent }}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>❤️</Text>
            <Text className="text-center font-medium" style={{ color: textColor }}>
              Made with love for readers everywhere
            </Text>
            <Text className="text-center text-sm mt-2" style={{ color: mutedColor }}>
              © 2024 IvyReader. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
