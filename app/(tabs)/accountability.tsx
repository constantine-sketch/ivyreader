/**
 * Accountability Tab
 * 
 * Chat with founders for accountability check-ins.
 * Elite-exclusive feature with async messaging system (1-2 responses per day).
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierBadge, UpgradeModal } from "@/components/tier-gate";

type ChatView = "list" | "conversation";

export default function AccountabilityScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const { tier, tierInfo, accentColor, isDarkTheme, isElite, isPremiumOrHigher } = useTierAccess();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [chatView, setChatView] = useState<ChatView>("list");
  const [messageText, setMessageText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // tRPC queries and mutations
  const utils = trpc.useUtils();
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = trpc.accountability.getMessages.useQuery(
    undefined,
    { enabled: isElite }
  );
  
  const sendMessageMutation = trpc.accountability.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText("");
      refetchMessages();
    },
  });
  
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

  const handleSendMessage = () => {
    if (!messageText.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({ content: messageText.trim() });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchMessages();
    setRefreshing(false);
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Non-Elite users see upgrade prompt
  if (!isElite) {
    return (
      <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <View className="flex-1 px-6 pt-6">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                Accountability
              </Text>
              <Text className="text-base mt-1" style={{ color: mutedColor }}>
                Stay on track with support
              </Text>
            </View>
            
            {/* Locked Feature Card */}
            <View 
              className="rounded-2xl p-6 items-center"
              style={{
                backgroundColor: `${goldAccent}10`,
                borderWidth: 2,
                borderColor: goldAccent,
              }}
            >
              <Text style={{ fontSize: 64, marginBottom: 16 }}>🔒</Text>
              <Text className="text-xl font-bold text-center mb-2" style={{ color: textColor }}>
                Elite Exclusive Feature
              </Text>
              <Text className="text-center mb-6" style={{ color: mutedColor }}>
                Unlock direct access to founders for personalized accountability check-ins to supercharge your reading journey.
              </Text>
              
              <View className="w-full mb-6">
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>💬</Text>
                  <Text style={{ color: textColor }}>Chat directly with founders</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>📊</Text>
                  <Text style={{ color: textColor }}>Personalized reading guidance</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>🎯</Text>
                  <Text style={{ color: textColor }}>Daily accountability check-ins</Text>
                </View>
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>⚡</Text>
                  <Text style={{ color: textColor }}>1-2 responses per day</Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => setShowUpgradeModal(true)}
                className="w-full py-4 rounded-xl items-center"
                style={{ backgroundColor: goldAccent }}
              >
                <Text className="font-bold text-base" style={{ color: "#000" }}>
                  Upgrade to Elite
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <UpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          targetTier="elite"
        />
      </ScreenContainer>
    );
  }

  // Conversation View (Elite users)
  if (chatView === "conversation") {
    return (
      <ScreenContainer 
        containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}
        edges={["top", "left", "right"]}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Chat Header */}
          <View 
            className="flex-row items-center px-4 py-3 border-b"
            style={{ borderBottomColor: borderColor }}
          >
            <TouchableOpacity
              onPress={() => setChatView("list")}
              className="mr-3"
            >
              <Text style={{ color: goldAccent, fontSize: 24 }}>←</Text>
            </TouchableOpacity>
            
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: goldAccent }}
            >
              <Text style={{ fontSize: 20 }}>👑</Text>
            </View>
            
            <View className="flex-1">
              <Text className="font-bold" style={{ color: textColor }}>
                IvyReader Founders
              </Text>
              <Text className="text-xs" style={{ color: mutedColor }}>
                Typically responds 1-2x daily
              </Text>
            </View>
          </View>
          
          {/* Messages */}
          {messagesLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={goldAccent} />
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              className="flex-1 px-4"
              contentContainerStyle={{ paddingVertical: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={goldAccent}
                />
              }
              ListEmptyComponent={
                <View className="items-center py-12">
                  <Text style={{ fontSize: 48, marginBottom: 16 }}>👋</Text>
                  <Text className="text-lg font-semibold text-center mb-2" style={{ color: textColor }}>
                    Welcome to Founder Chat!
                  </Text>
                  <Text className="text-center px-8" style={{ color: mutedColor }}>
                    Send a message to start your accountability journey. We typically respond 1-2 times per day.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View 
                  className={`mb-3 max-w-[80%] ${item.senderType === "user" ? "self-end" : "self-start"}`}
                >
                  <View 
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      backgroundColor: item.senderType === "user" ? goldAccent : cardBg,
                      borderWidth: item.senderType === "user" ? 0 : 1,
                      borderColor: borderColor,
                    }}
                  >
                    <Text style={{ color: item.senderType === "user" ? "#000" : textColor }}>
                      {item.content}
                    </Text>
                  </View>
                  <Text 
                    className={`text-xs mt-1 ${item.senderType === "user" ? "text-right" : "text-left"}`}
                    style={{ color: mutedColor }}
                  >
                    {formatMessageTime(String(item.createdAt))}
                  </Text>
                </View>
              )}
            />
          )}
          
          {/* Message Input */}
          <View 
            className="flex-row items-center px-4 py-3 border-t"
            style={{ 
              borderTopColor: borderColor,
              backgroundColor: cardBg,
            }}
          >
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              placeholderTextColor={mutedColor}
              className="flex-1 px-4 py-3 rounded-full mr-3"
              style={{
                backgroundColor: isDarkTheme ? "#0a0a0a" : colors.background,
                color: textColor,
                borderWidth: 1,
                borderColor: borderColor,
              }}
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
              editable={!sendMessageMutation.isPending}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: goldAccent,
                opacity: sendMessageMutation.isPending ? 0.5 : 1,
              }}
              disabled={sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={{ fontSize: 18 }}>→</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // Chat List View (Elite users)
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const unreadCount = messages.filter(m => m.senderType === "founder" && !m.isRead).length;
  
  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={goldAccent}
            />
          }
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                Accountability
              </Text>
              <TierBadge size="small" />
            </View>
            <Text className="text-base" style={{ color: mutedColor }}>
              Your support network
            </Text>
          </View>

          {/* Founder Chat - Prominent */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: goldAccent }}>
              FOUNDER ACCESS
            </Text>
            
            <TouchableOpacity
              onPress={() => setChatView("conversation")}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: `${goldAccent}10`,
                borderWidth: 2,
                borderColor: goldAccent,
              }}
            >
              <View className="p-4 flex-row items-center">
                <View 
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: goldAccent }}
                >
                  <Text style={{ fontSize: 28 }}>👑</Text>
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-bold text-lg" style={{ color: textColor }}>
                      IvyReader Founders
                    </Text>
                    {unreadCount > 0 && (
                      <View 
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.error }}
                      >
                        <Text className="text-xs font-bold" style={{ color: "#fff" }}>
                          {unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    {lastMessage 
                      ? `${lastMessage.senderType === "user" ? "You: " : ""}${lastMessage.content.substring(0, 40)}${lastMessage.content.length > 40 ? "..." : ""}`
                      : "Tap to start your accountability journey"
                    }
                  </Text>
                  {lastMessage && (
                    <Text className="text-xs mt-1" style={{ color: mutedColor }}>
                      {formatMessageTime(String(lastMessage.createdAt))}
                    </Text>
                  )}
                </View>
                
                <Text style={{ color: goldAccent, fontSize: 20 }}>→</Text>
              </View>
              
              {/* Response time indicator */}
              <View 
                className="px-4 py-2 flex-row items-center justify-center"
                style={{ backgroundColor: `${goldAccent}20` }}
              >
                <Text style={{ fontSize: 12, marginRight: 6 }}>⏱️</Text>
                <Text className="text-xs" style={{ color: goldAccent }}>
                  Typically responds 1-2x daily
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* How it works */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
              HOW IT WORKS
            </Text>
            
            <View 
              className="rounded-2xl p-4"
              style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: borderColor }}
            >
              <View className="flex-row items-start mb-4">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text style={{ fontSize: 14 }}>1</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Share your goals</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Tell us what you're reading and your targets
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start mb-4">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text style={{ fontSize: 14 }}>2</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Daily check-ins</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Send updates on your reading progress
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text style={{ fontSize: 14 }}>3</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Get personalized guidance</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Receive tailored advice and encouragement
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Accountability Partner */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
              READING BUDDY
            </Text>
            
            <TouchableOpacity
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
              activeOpacity={0.7}
            >
              <View className="p-4 flex-row items-center">
                <View 
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${goldAccent}20`, borderWidth: 2, borderColor: `${goldAccent}40`, borderStyle: 'dashed' }}
                >
                  <Text style={{ fontSize: 28 }}>🤝</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="font-bold text-lg" style={{ color: textColor }}>
                    Find Your Reading Buddy
                  </Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    Get matched with an accountability partner who shares your reading goals
                  </Text>
                </View>
                
                <Text style={{ color: goldAccent, fontSize: 20 }}>→</Text>
              </View>
              
              {/* Matching status */}
              <View 
                className="px-4 py-3 flex-row items-center justify-between"
                style={{ backgroundColor: `${goldAccent}10` }}
              >
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 14, marginRight: 8 }}>✨</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Matching available
                  </Text>
                </View>
                <View 
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: goldAccent }}
                >
                  <Text className="text-xs font-bold" style={{ color: "#000" }}>
                    GET MATCHED
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Partner benefits */}
            <View className="mt-3 flex-row flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <Text style={{ fontSize: 12, marginRight: 4 }}>💬</Text>
                <Text className="text-xs" style={{ color: mutedColor }}>Weekly check-ins</Text>
              </View>
              <View className="flex-row items-center mr-4 mb-2">
                <Text style={{ fontSize: 12, marginRight: 4 }}>🎯</Text>
                <Text className="text-xs" style={{ color: mutedColor }}>Shared goals</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Text style={{ fontSize: 12, marginRight: 4 }}>📊</Text>
                <Text className="text-xs" style={{ color: mutedColor }}>Progress tracking</Text>
              </View>
            </View>
          </View>

          {/* Pomodoro Sessions */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
              GROUP SESSIONS
            </Text>
            
            <View 
              className="rounded-2xl p-4"
              style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: borderColor }}
            >
              <View className="flex-row items-center mb-3">
                <Text style={{ fontSize: 24, marginRight: 12 }}>🍅</Text>
                <View className="flex-1">
                  <Text className="font-bold" style={{ color: textColor }}>Pomodoro Reading Sessions</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Join live group reading sessions
                  </Text>
                </View>
              </View>
              
              <View 
                className="rounded-xl p-3 flex-row items-center justify-between"
                style={{ backgroundColor: `${goldAccent}10` }}
              >
                <View>
                  <Text className="font-semibold" style={{ color: textColor }}>Next Session</Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>Coming soon</Text>
                </View>
                <View 
                  className="px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${goldAccent}30` }}
                >
                  <Text className="text-xs font-medium" style={{ color: goldAccent }}>
                    NOTIFY ME
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom padding for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
      
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        targetTier="elite"
      />
    </ScreenContainer>
  );
}
