import { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Pressable, ActivityIndicator, Platform, RefreshControl, TouchableOpacity, Animated } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { formatDuration } from "@/lib/mock-data";
import { router } from "expo-router";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierBadge, UpgradeModal } from "@/components/tier-gate";

export default function ProfileScreen() {
  const colors = useColors();
  const { logout } = useAuth();
  const { data: user } = trpc.auth.me.useQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { accentColor, isDarkTheme, isElite, isPremiumOrHigher } = useTierAccess();
  
  // Animation for AI teaser
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isElite) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isElite]);
  
  // Fetch real data from database
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.stats.get.useQuery();
  const { data: books, isLoading: booksLoading, refetch: refetchBooks } = trpc.books.list.useQuery();
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchBooks()]);
    setRefreshing(false);
  };
  
  const isLoading = statsLoading || booksLoading;
  
  // Theme colors
  const bgColor = isDarkTheme ? "#0a0a0a" : colors.background;
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  const goldAccent = "#FFD700";
  
  if (isLoading) {
    return (
      <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={accentColor} />
        </View>
      </ScreenContainer>
    );
  }
  
  const totalTimeFormatted = formatDuration(stats?.totalMinutesRead || 0);
  const booksCompleted = stats?.booksCompleted || 0;
  const totalPages = stats?.totalPagesRead || 0;
  
  // Calculate focus score
  const focusScore = stats?.totalPagesRead && stats?.totalMinutesRead 
    ? Math.min(100, Math.round((stats.totalPagesRead / stats.totalMinutesRead) * 20))
    : 0;
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={accentColor}
            colors={[accentColor]}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-3xl font-bold" style={{ color: textColor }}>Profile</Text>
          <TierBadge size="small" />
        </View>

        {/* User Info Card */}
        <View className="px-6 mb-6">
          <View 
            className="rounded-2xl p-6 items-center"
            style={{ 
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ 
                backgroundColor: isElite ? `${goldAccent}20` : `${accentColor}20`,
                borderWidth: 2,
                borderColor: isElite ? goldAccent : accentColor,
              }}
            >
              {user?.avatar ? (
                <Text style={{ fontSize: 48 }}>{user.avatar}</Text>
              ) : (
                <Text className="text-4xl font-bold" style={{ color: accentColor }}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </Text>
              )}
            </View>
            <Text className="text-2xl font-bold mb-1" style={{ color: textColor }}>
              {user?.name || 'User'}
            </Text>
            {user?.username && (
              <Text className="text-sm mb-2" style={{ color: mutedColor }}>
                @{user.username}
              </Text>
            )}
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
              <Text className="text-xs font-semibold" style={{ color: accentColor }}>
                {focusScore > 90 ? 'Top 1% Reader' : focusScore > 75 ? 'Top 5% Reader' : 'Active Reader'}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Concierge Teaser - Elite Feature */}
        {isElite ? (
          // Elite users get direct access
          <View className="px-6 mb-6">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/concierge')}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: `${goldAccent}15`,
                borderWidth: 2,
                borderColor: goldAccent,
              }}
            >
              <View className="flex-row items-center mb-3">
                <Text style={{ fontSize: 28, marginRight: 12 }}>🤖</Text>
                <View className="flex-1">
                  <Text className="text-lg font-bold" style={{ color: textColor }}>
                    AI Reading Concierge
                  </Text>
                  <Text className="text-sm" style={{ color: mutedColor }}>
                    Your personal book recommendation engine
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm" style={{ color: goldAccent }}>
                  3 new recommendations ready
                </Text>
                <View 
                  className="px-4 py-2 rounded-xl"
                  style={{ backgroundColor: goldAccent }}
                >
                  <Text className="font-bold" style={{ color: "#000" }}>
                    Open →
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          // Non-Elite users see teaser with upgrade prompt
          <View className="px-6 mb-6">
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => setShowUpgradeModal(true)}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: isDarkTheme ? "#151515" : colors.surface,
                  borderWidth: 2,
                  borderColor: goldAccent,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View 
                    className="w-14 h-14 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${goldAccent}20` }}
                  >
                    <Text style={{ fontSize: 28 }}>🤖</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-lg font-bold mr-2" style={{ color: textColor }}>
                        AI Reading Concierge
                      </Text>
                      <View 
                        className="px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${goldAccent}20` }}
                      >
                        <Text className="text-xs font-bold" style={{ color: goldAccent }}>
                          ELITE
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm" style={{ color: mutedColor }}>
                      Get personalized book recommendations powered by AI
                    </Text>
                  </View>
                </View>
                
                <View 
                  className="p-3 rounded-xl mb-3"
                  style={{ backgroundColor: isDarkTheme ? "#1a1a1a" : colors.border + "30" }}
                >
                  <View className="flex-row items-center mb-2">
                    <Text style={{ fontSize: 14, marginRight: 8 }}>✨</Text>
                    <Text className="text-sm" style={{ color: textColor }}>
                      Mood-based recommendations
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Text style={{ fontSize: 14, marginRight: 8 }}>🎯</Text>
                    <Text className="text-sm" style={{ color: textColor }}>
                      Match scores based on your reading history
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 14, marginRight: 8 }}>💬</Text>
                    <Text className="text-sm" style={{ color: textColor }}>
                      Ask for books in natural language
                    </Text>
                  </View>
                </View>
                
                <View 
                  className="py-3 rounded-xl items-center"
                  style={{ backgroundColor: goldAccent }}
                >
                  <Text className="font-bold" style={{ color: "#000" }}>
                    Upgrade to Elite to Unlock
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Upgrade Button (only show if not on Elite tier) */}
        {!isElite && (
          <View className="px-6 mb-6">
            <Pressable
              onPress={() => setShowUpgradeModal(true)}
              className="py-3 rounded-lg items-center"
              style={({ pressed }) => [{
                borderWidth: 2,
                borderColor: accentColor,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-sm font-semibold" style={{ color: accentColor }}>
                {isPremiumOrHigher ? 'Upgrade to Elite' : 'Upgrade to Premium'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Reading Statistics */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Reading Statistics</Text>
          
          <View 
            className="rounded-2xl p-4 mb-3"
            style={{ 
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: borderColor }}>
              <Text style={{ color: mutedColor }}>Current Streak</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{stats?.currentStreak || 0} Days</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: borderColor }}>
              <Text style={{ color: mutedColor }}>Total Pages Read</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{totalPages.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: borderColor }}>
              <Text style={{ color: mutedColor }}>Focus Score</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{focusScore}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: borderColor }}>
              <Text style={{ color: mutedColor }}>Time Invested</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{totalTimeFormatted}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: borderColor }}>
              <Text style={{ color: mutedColor }}>Books Completed</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{booksCompleted}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Text style={{ color: mutedColor }}>Percentile Ranking</Text>
              <Text className="text-lg font-bold" style={{ color: accentColor }}>Top 5%</Text>
            </View>
          </View>
        </View>

        {/* Reading Goals */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Reading Goals</Text>
          
          <View 
            className="rounded-2xl p-4"
            style={{ 
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ color: mutedColor }}>Daily Goal</Text>
              <Text className="text-lg font-bold" style={{ color: textColor }}>{stats?.dailyGoalMinutes || 60} min</Text>
            </View>
            <Text className="text-xs mb-2" style={{ color: mutedColor }}>
              Adjust your daily reading target
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => console.log('Set goal: 30')}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ borderWidth: 1, borderColor: borderColor }}
              >
                <Text className="text-sm" style={{ color: textColor }}>30 min</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log('Set goal: 60')}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="text-sm font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>60 min</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log('Set goal: 90')}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ borderWidth: 1, borderColor: borderColor }}
              >
                <Text className="text-sm" style={{ color: textColor }}>90 min</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Premium Services */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Premium Services</Text>
          
          <View className="gap-3">
            {/* Ivy League Consulting */}
            <Pressable
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('https://calendly.com/ivyreader/ivy-league-consulting', '_blank');
                } else {
                  import('expo-web-browser').then(WebBrowser => {
                    WebBrowser.openBrowserAsync('https://calendly.com/ivyreader/ivy-league-consulting');
                  });
                }
              }}
              className="rounded-2xl p-5"
              style={({ pressed }) => [{
                backgroundColor: cardBg,
                borderWidth: 2,
                borderColor: accentColor,
                opacity: pressed ? 0.8 : 1
              }]}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold flex-1" style={{ color: textColor }}>
                  Ivy League Consulting for Families
                </Text>
                <Text className="text-2xl">🎓</Text>
              </View>
              <Text className="text-sm mb-3" style={{ color: mutedColor }}>
                Expert guidance for college admissions, academic planning, and family strategy sessions
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm font-semibold" style={{ color: accentColor }}>
                  Book a Discovery Call →
                </Text>
              </View>
            </Pressable>
            
            {/* 90-Day Attention Span */}
            <Pressable
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('https://calendly.com/ivyreader/90-day-attention-span', '_blank');
                } else {
                  import('expo-web-browser').then(WebBrowser => {
                    WebBrowser.openBrowserAsync('https://calendly.com/ivyreader/90-day-attention-span');
                  });
                }
              }}
              className="rounded-2xl p-5"
              style={({ pressed }) => [{
                backgroundColor: cardBg,
                borderWidth: 2,
                borderColor: accentColor,
                opacity: pressed ? 0.8 : 1
              }]}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold flex-1" style={{ color: textColor }}>
                  90-Day Attention Span 1-on-1 Consulting
                </Text>
                <Text className="text-2xl">🎯</Text>
              </View>
              <Text className="text-sm mb-3" style={{ color: mutedColor }}>
                Transform your focus and reading habits with personalized coaching
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm font-semibold" style={{ color: accentColor }}>
                  Book a Discovery Call →
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        
        {/* Settings */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Settings</Text>
          
          <View 
            className="rounded-2xl"
            style={{ 
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Pressable
              onPress={() => router.push('/subscription')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: borderColor,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <View className="flex-row items-center gap-2">
                <Text style={{ color: textColor }}>Subscription</Text>
                <View className="px-2 py-0.5 rounded" style={{ backgroundColor: `${accentColor}20` }}>
                  <Text className="text-xs font-semibold" style={{ color: accentColor }}>
                    {(user?.subscriptionTier || 'free').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={{ color: mutedColor }}>›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('/edit-profile')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: borderColor,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text style={{ color: textColor }}>Edit Profile</Text>
              <Text style={{ color: mutedColor }}>›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('/settings-notifications')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: borderColor,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text style={{ color: textColor }}>Notifications</Text>
              <Text style={{ color: mutedColor }}>›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('/settings-privacy')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: borderColor,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text style={{ color: textColor }}>Privacy</Text>
              <Text style={{ color: mutedColor }}>›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('/about')}
              className="flex-row justify-between items-center p-4"
              style={({ pressed }) => [{ 
                borderBottomColor: borderColor,
                borderBottomWidth: (user as any)?.role === 'admin' ? 1 : 0,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text style={{ color: textColor }}>About IvyReader</Text>
              <Text style={{ color: mutedColor }}>›</Text>
            </Pressable>
            
            {/* Admin Dashboard - only visible to admins */}
            {(user as any)?.role === 'admin' && (
              <Pressable
                onPress={() => router.push('/admin')}
                className="flex-row justify-between items-center p-4"
                style={({ pressed }) => [{ 
                  opacity: pressed ? 0.7 : 1
                }]}
              >
                <View className="flex-row items-center gap-2">
                  <Text style={{ color: textColor }}>Admin Dashboard</Text>
                  <View className="px-2 py-0.5 rounded" style={{ backgroundColor: '#EF4444' }}>
                    <Text className="text-xs font-bold" style={{ color: '#fff' }}>ADMIN</Text>
                  </View>
                </View>
                <Text style={{ color: mutedColor }}>›</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6">
          <Pressable
            onPress={async () => {
              await logout();
              console.log('User logged out');
              router.replace('/');
            }}
            className="py-3 rounded-lg items-center"
            style={({ pressed }) => [{
              backgroundColor: isDarkTheme ? "#1a1a1a" : colors.surface,
              borderWidth: 1,
              borderColor: isDarkTheme ? "#333" : colors.border,
              opacity: pressed ? 0.7 : 1
            }]}
          >
            <Text className="text-sm font-semibold" style={{ color: colors.error }}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        targetTier={isPremiumOrHigher ? "elite" : "premium"}
      />
    </ScreenContainer>
  );
}
