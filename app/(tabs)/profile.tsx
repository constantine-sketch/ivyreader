import { Text, View, ScrollView, Pressable, ActivityIndicator, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { formatDuration } from "@/lib/mock-data";
import { router } from "expo-router";

export default function ProfileScreen() {
  const colors = useColors();
  const { logout } = useAuth();
  const { data: user } = trpc.auth.me.useQuery();
  
  // Fetch real data from database
  const { data: stats, isLoading: statsLoading } = trpc.stats.get.useQuery();
  const { data: books, isLoading: booksLoading } = trpc.books.list.useQuery();
  
  const isLoading = statsLoading || booksLoading;
  
  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
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
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">Profile</Text>
        </View>

        {/* User Info Card */}
        <View className="px-6 mb-6">
          <View className="rounded-2xl p-6 border items-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-4xl font-bold" style={{ color: colors.background }}>
                {user?.name ? getInitials(user.name) : 'U'}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-1">
              {user?.name || 'User'}
            </Text>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                {focusScore > 90 ? 'Top 1% Reader' : focusScore > 75 ? 'Top 5% Reader' : 'Active Reader'}
              </Text>
            </View>
          </View>
        </View>

        {/* Upgrade Button (only show if not on Elite tier) */}
        {user?.subscriptionTier !== 'elite' && (
          <View className="px-6 mb-6">
            <Pressable
              onPress={() => router.push('/subscription')}
              className="py-3 rounded-lg items-center border"
              style={({ pressed }) => [{
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                {user?.subscriptionTier === 'premium' ? 'Upgrade to Elite' : 'Upgrade to Premium'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Reading Statistics */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Reading Statistics</Text>
          
          <View className="rounded-2xl p-4 border mb-3" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <Text className="text-muted">Current Streak</Text>
              <Text className="text-lg font-bold text-foreground">{stats?.currentStreak || 0} Days</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <Text className="text-muted">Total Pages Read</Text>
              <Text className="text-lg font-bold text-foreground">{totalPages.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <Text className="text-muted">Focus Score</Text>
              <Text className="text-lg font-bold text-foreground">{focusScore}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <Text className="text-muted">Time Invested</Text>
              <Text className="text-lg font-bold text-foreground">{totalTimeFormatted}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <Text className="text-muted">Books Completed</Text>
              <Text className="text-lg font-bold text-foreground">{booksCompleted}</Text>
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-muted">Percentile Ranking</Text>
              <Text className="text-lg font-bold" style={{ color: colors.primary }}>Top 5%</Text>
            </View>
          </View>
        </View>

        {/* Reading Goals */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Reading Goals</Text>
          
          <View className="rounded-2xl p-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-muted">Daily Goal</Text>
              <Text className="text-lg font-bold text-foreground">{stats?.dailyGoalMinutes || 60} min</Text>
            </View>
            <Text className="text-xs text-muted mb-2">
              Adjust your daily reading target
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => console.log('Set goal: 30')}
                className="flex-1 py-2 rounded-lg items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="text-sm text-foreground">30 min</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log('Set goal: 60')}
                className="flex-1 py-2 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-sm font-bold" style={{ color: colors.background }}>60 min</Text>
              </Pressable>
              <Pressable
                onPress={() => console.log('Set goal: 90')}
                className="flex-1 py-2 rounded-lg items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="text-sm text-foreground">90 min</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Settings</Text>
          
          <View className="rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Pressable
              onPress={() => router.push('/subscription')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: colors.border,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-foreground">Subscription</Text>
                <View className="px-2 py-0.5 rounded" style={{ backgroundColor: colors.primary + '20' }}>
                  <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                    {(user?.subscriptionTier || 'free').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text className="text-muted">›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => console.log('Edit Profile')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: colors.border,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-foreground">Edit Profile</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => console.log('Notifications')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: colors.border,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-foreground">Notifications</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => console.log('Privacy')}
              className="flex-row justify-between items-center p-4 border-b"
              style={({ pressed }) => [{ 
                borderBottomColor: colors.border,
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-foreground">Privacy</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
            
            <Pressable
              onPress={() => console.log('About')}
              className="flex-row justify-between items-center p-4"
              style={({ pressed }) => [{ 
                opacity: pressed ? 0.7 : 1
              }]}
            >
              <Text className="text-foreground">About IvyReader</Text>
              <Text className="text-muted">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6">
          <Pressable
            onPress={async () => {
              await logout();
              console.log('User logged out');
              // On web, reload the page to trigger auth check
              if (Platform.OS === 'web') {
                window.location.reload();
              }
            }}
            className="py-3 rounded-lg items-center border"
            style={({ pressed }) => [{ 
              borderColor: colors.error,
              opacity: pressed ? 0.7 : 1
            }]}
          >
            <Text className="font-bold" style={{ color: colors.error }}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
