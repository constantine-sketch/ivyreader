/**
 * Accountability Tab
 * 
 * Chat with founders and accountability partners.
 * Elite-exclusive feature with messaging system.
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierBadge, UpgradeModal } from "@/components/tier-gate";

// Mock conversations
const FOUNDER_CHAT = {
  id: "founder",
  name: "IvyReader Founders",
  avatar: "👑",
  lastMessage: "Welcome to Elite! How can we help you reach your reading goals?",
  timestamp: "Just now",
  unread: 1,
  isOnline: true,
};

const MOCK_PARTNER = {
  id: "partner",
  name: "Reading Buddy",
  avatar: "📚",
  lastMessage: "Tap to find your accountability partner",
  timestamp: "",
  unread: 0,
  isOnline: false,
  isPlaceholder: true,
};

// Mock messages for founder chat
const FOUNDER_MESSAGES = [
  { id: "1", sender: "founder", text: "Welcome to IvyReader Elite! 👑", timestamp: "10:00 AM" },
  { id: "2", sender: "founder", text: "We're here to help you achieve your reading goals. Feel free to ask us anything about the app, reading strategies, or book recommendations.", timestamp: "10:00 AM" },
  { id: "3", sender: "founder", text: "What are you currently reading?", timestamp: "10:01 AM" },
];

type ChatView = "list" | "conversation";

export default function AccountabilityScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const { tier, tierInfo, accentColor, isDarkTheme, isElite, isPremiumOrHigher } = useTierAccess();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [chatView, setChatView] = useState<ChatView>("list");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(FOUNDER_MESSAGES);
  
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
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // Simulate founder response
    setTimeout(() => {
      const responses = [
        "That's a great choice! How are you finding it so far?",
        "I love that book! What chapter are you on?",
        "Excellent! Keep up the great reading habit.",
        "Have you tried our Pomodoro sessions? They're great for focused reading.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "founder",
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  const openChat = (chatId: string) => {
    if (chatId === "partner" && MOCK_PARTNER.isPlaceholder) {
      // Show partner matching flow
      return;
    }
    setActiveChat(chatId);
    setChatView("conversation");
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
                Unlock direct access to founders and get matched with an accountability partner to supercharge your reading journey.
              </Text>
              
              <View className="w-full mb-6">
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>💬</Text>
                  <Text style={{ color: textColor }}>Chat directly with founders</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>🤝</Text>
                  <Text style={{ color: textColor }}>Get matched with a reading buddy</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>📊</Text>
                  <Text style={{ color: textColor }}>Track progress together</Text>
                </View>
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 20, marginRight: 12 }}>🎯</Text>
                  <Text style={{ color: textColor }}>Weekly check-ins</Text>
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

  // Conversation View
  if (chatView === "conversation" && activeChat) {
    const chatInfo = activeChat === "founder" ? FOUNDER_CHAT : MOCK_PARTNER;
    
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
              onPress={() => {
                setChatView("list");
                setActiveChat(null);
              }}
              className="mr-3"
            >
              <Text style={{ color: goldAccent, fontSize: 24 }}>←</Text>
            </TouchableOpacity>
            
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${goldAccent}20` }}
            >
              <Text style={{ fontSize: 20 }}>{chatInfo.avatar}</Text>
            </View>
            
            <View className="flex-1">
              <Text className="font-bold" style={{ color: textColor }}>
                {chatInfo.name}
              </Text>
              {chatInfo.isOnline && (
                <View className="flex-row items-center">
                  <View 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: colors.success }}
                  />
                  <Text className="text-xs" style={{ color: colors.success }}>
                    Online
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 16 }}
            renderItem={({ item }) => (
              <View 
                className={`mb-3 max-w-[80%] ${item.sender === "user" ? "self-end" : "self-start"}`}
              >
                <View 
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: item.sender === "user" ? goldAccent : cardBg,
                    borderWidth: item.sender === "user" ? 0 : 1,
                    borderColor: borderColor,
                  }}
                >
                  <Text style={{ color: item.sender === "user" ? "#000" : textColor }}>
                    {item.text}
                  </Text>
                </View>
                <Text 
                  className={`text-xs mt-1 ${item.sender === "user" ? "text-right" : "text-left"}`}
                  style={{ color: mutedColor }}
                >
                  {item.timestamp}
                </Text>
              </View>
            )}
          />
          
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
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: goldAccent }}
            >
              <Text style={{ fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // Chat List View (Elite users)
  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
              onPress={() => openChat("founder")}
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
                    <Text className="text-lg font-bold" style={{ color: textColor }}>
                      {FOUNDER_CHAT.name}
                    </Text>
                    {FOUNDER_CHAT.unread > 0 && (
                      <View 
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: goldAccent }}
                      >
                        <Text className="text-xs font-bold" style={{ color: "#000" }}>
                          {FOUNDER_CHAT.unread}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <View 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: colors.success }}
                    />
                    <Text className="text-xs" style={{ color: colors.success }}>
                      Online now
                    </Text>
                  </View>
                  
                  <Text 
                    className="text-sm mt-2"
                    style={{ color: mutedColor }}
                    numberOfLines={1}
                  >
                    {FOUNDER_CHAT.lastMessage}
                  </Text>
                </View>
              </View>
              
              <View 
                className="px-4 py-3 flex-row items-center justify-center"
                style={{ backgroundColor: `${goldAccent}20` }}
              >
                <Text className="font-semibold" style={{ color: goldAccent }}>
                  Start Conversation →
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Accountability Partner */}
          <View className="px-6 mb-6">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: accentColor }}>
              ACCOUNTABILITY PARTNER
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                // Show partner matching modal
              }}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View className="flex-row items-center">
                <View 
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{ 
                    backgroundColor: `${accentColor}20`,
                    borderWidth: 2,
                    borderColor: accentColor,
                    borderStyle: "dashed",
                  }}
                >
                  <Text style={{ fontSize: 28 }}>🤝</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-lg font-bold" style={{ color: textColor }}>
                    Find Your Reading Buddy
                  </Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    Get matched with someone who shares your reading goals
                  </Text>
                </View>
              </View>
              
              <View 
                className="mt-4 py-3 rounded-xl items-center"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                  Find a Partner
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* How It Works */}
          <View className="px-6 mb-8">
            <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: accentColor }}>
              HOW IT WORKS
            </Text>
            
            <View 
              className="rounded-2xl p-4"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View className="flex-row items-start mb-4">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text className="font-bold" style={{ color: goldAccent }}>1</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Get Matched</Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    We pair you with a reader who has similar goals and interests
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start mb-4">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text className="font-bold" style={{ color: goldAccent }}>2</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Weekly Check-ins</Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    Share your progress and keep each other accountable
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${goldAccent}20` }}
                >
                  <Text className="font-bold" style={{ color: goldAccent }}>3</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: textColor }}>Achieve Together</Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    Celebrate milestones and push each other to read more
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}
