import { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator, Image, RefreshControl, Animated, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { LogSessionModal } from "@/components/log-session-modal";
import { BookPickerModal } from "@/components/book-picker-modal";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierBadge } from "@/components/tier-gate";

import { 
  getGreeting,
  formatDate,
  formatDuration
} from "@/lib/mock-data";

export default function DashboardScreen() {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const { accentColor, isDarkTheme, isElite, isPremiumOrHigher, tierInfo } = useTierAccess();

  const [refreshing, setRefreshing] = useState(false);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Fetch real data from API
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.stats.get.useQuery();
  const { data: books, isLoading: booksLoading, refetch: refetchBooks } = trpc.books.list.useQuery();
  const { data: sessions, refetch: refetchSessions } = trpc.sessions.listByUser.useQuery({ limit: 7 });
  const { data: user } = trpc.auth.me.useQuery();
  
  // Mutation for creating sessions
  const createSession = trpc.sessions.create.useMutation();
  const updateBook = trpc.books.update.useMutation();
  
  const isLoading = statsLoading || booksLoading;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchStats(),
      refetchBooks(),
      refetchSessions()
    ]);
    setRefreshing(false);
  };
  
  if (isLoading) {
    return (
      <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={accentColor} />
        </View>
      </ScreenContainer>
    );
  }
  
  // Get currently reading book
  const currentBook = books?.find(b => b.status === 'reading');
  const queueBooks = books?.filter(b => b.status === 'queue').slice(0, 3) || [];
  
  // Skip fetching notes on dashboard to avoid hook count issues
  const notes: any[] = [];
  
  // Calculate today's minutes from sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = sessions?.filter(s => {
    const sessionDate = new Date(s.createdAt);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  }) || [];
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  
  // Calculate weekly volume for chart
  const weeklyVolume = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    const daySessions = sessions?.filter(s => {
      const sessionDate = new Date(s.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
    }) || [];
    return daySessions.reduce((sum, s) => sum + (s.endPage - s.startPage), 0);
  });
  
  const progressPercentage = currentBook ? Math.round((currentBook.currentPage / currentBook.totalPages) * 100) : 0;
  const pagesLeft = currentBook ? currentBook.totalPages - currentBook.currentPage : 0;
  const streakComparison = (stats?.currentStreak || 0) - 7; // Compare to average of 7 days
  const totalTimeFormatted = formatDuration(stats?.totalMinutesRead || 0);
  const dailyGoal = stats?.dailyGoalMinutes || 60;
  
  // Calculate focus score (pages read / time spent ratio, normalized to 100)
  const focusScore = stats?.totalPagesRead && stats?.totalMinutesRead 
    ? Math.min(100, Math.round((stats.totalPagesRead / stats.totalMinutesRead) * 20))
    : 0;

  // Theme colors based on tier
  const bgColor = isDarkTheme ? "#0a0a0a" : colors.background;
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;

  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
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
          {/* Header Section */}
          <View className="px-6 pt-6 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-4xl font-bold" style={{ color: textColor, fontFamily: 'System' }}>
                  {getGreeting()}.
                </Text>
                <Text className="text-xs mt-1 tracking-wider" style={{ color: mutedColor }}>
                  {formatDate()}
                </Text>
              </View>
              <TierBadge size="medium" />
            </View>
          </View>

          {/* Elite Welcome Banner */}
          {isElite && (
            <View className="px-6 mb-6">
              <View 
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderWidth: 1,
                  borderColor: accentColor,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Text style={{ fontSize: 20, marginRight: 8 }}>👑</Text>
                  <Text className="text-lg font-bold" style={{ color: accentColor }}>
                    Elite Member
                  </Text>
                </View>
                <Text className="text-sm mb-3" style={{ color: mutedColor }}>
                  Your AI Concierge has 3 new personalized recommendations ready.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/concierge')}
                  className="self-start px-4 py-2 rounded-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text className="font-semibold" style={{ color: "#000" }}>
                    View Recommendations →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Premium Welcome Banner */}
          {!isElite && isPremiumOrHigher && (
            <View className="px-6 mb-6">
              <View 
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderWidth: 1,
                  borderColor: accentColor,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Text style={{ fontSize: 20, marginRight: 8 }}>⭐</Text>
                  <Text className="text-lg font-bold" style={{ color: accentColor }}>
                    Premium Member
                  </Text>
                </View>
                <Text className="text-sm mb-3" style={{ color: mutedColor }}>
                  New curated reading list available: "Ivy League Essentials"
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/reading-lists')}
                  className="self-start px-4 py-2 rounded-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text className="font-semibold" style={{ color: "#fff" }}>
                    Browse Lists →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Daily Goal and Action Buttons */}
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-xs mb-1" style={{ color: mutedColor }}>DAILY GOAL</Text>
                <Text className="text-2xl font-bold" style={{ color: textColor }}>
                  {todayMinutes} / {dailyGoal} min
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowBookPicker(true)}
                className="flex-1 items-center justify-center"
                style={({ pressed }) => [{
                  backgroundColor: accentColor,
                  paddingVertical: 12,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                }]}
              >
                <Text className="text-sm font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                  Resume Reading
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-6 mb-6 flex-row flex-wrap gap-3">
            {/* Current Streak */}
            <View 
              className="flex-1 min-w-[45%] p-4 rounded-xl"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs mb-1" style={{ color: accentColor }}>
                {streakComparison >= 0 ? `+${streakComparison}` : streakComparison} days vs avg
              </Text>
              <Text className="text-xs mb-2" style={{ color: mutedColor }}>CURRENT STREAK</Text>
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                {stats?.currentStreak || 0} Days
              </Text>
            </View>

            {/* Pages Read */}
            <View 
              className="flex-1 min-w-[45%] p-4 rounded-xl"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs mb-1" style={{ color: accentColor }}>
                +15% vs Q3
              </Text>
              <Text className="text-xs mb-2" style={{ color: mutedColor }}>PAGES READ (Q4)</Text>
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                {stats?.totalPagesRead?.toLocaleString() || 0}
              </Text>
            </View>

            {/* Focus Score */}
            <View 
              className="flex-1 min-w-[45%] p-4 rounded-xl"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs mb-1" style={{ color: mutedColor }}>Top 5% of users</Text>
              <Text className="text-xs mb-2" style={{ color: mutedColor }}>FOCUS SCORE</Text>
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                {focusScore}
              </Text>
            </View>

            {/* Time Invested */}
            <View 
              className="flex-1 min-w-[45%] p-4 rounded-xl"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-xs mb-1" style={{ color: mutedColor }}>1.2h daily avg</Text>
              <Text className="text-xs mb-2" style={{ color: mutedColor }}>TIME INVESTED</Text>
              <Text className="text-3xl font-bold" style={{ color: textColor }}>
                {totalTimeFormatted}
              </Text>
            </View>
          </View>

          {/* Currently Reading */}
          {currentBook && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-bold" style={{ color: textColor }}>Currently Reading</Text>
                <Pressable onPress={() => router.push('/(tabs)/library')}>
                  <Text className="text-sm" style={{ color: accentColor }}>VIEW LIBRARY</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => router.push(`/book-detail?bookId=${currentBook.id}`)}
                style={({ pressed }) => [{
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <View 
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <View className="flex-row mb-4">
                    {/* Book Cover */}
                    {currentBook.coverUrl ? (
                      <Image
                        source={{ uri: currentBook.coverUrl }}
                        className="w-20 h-28 rounded-lg mr-4"
                        style={{ backgroundColor: borderColor }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View 
                        className="w-20 h-28 rounded-lg mr-4 items-center justify-center" 
                        style={{ backgroundColor: borderColor }}
                      >
                        <Text className="text-4xl">📚</Text>
                      </View>
                    )}
                    
                    <View className="flex-1">
                      <Text className="text-xs mb-1 tracking-wider" style={{ color: accentColor }}>
                        {currentBook.category?.toUpperCase()}
                      </Text>
                      <Text className="text-xs mb-1" style={{ color: accentColor }}>
                        {progressPercentage}% Complete
                      </Text>
                      <Text className="text-lg font-bold mb-1" style={{ color: textColor }} numberOfLines={2}>
                        {currentBook.title}
                      </Text>
                      <Text className="text-sm" style={{ color: mutedColor }}>{currentBook.author}</Text>
                    </View>
                  </View>

                  {/* Progress Info */}
                  <View className="mb-3">
                    <Text className="text-xs mb-2" style={{ color: mutedColor }}>
                      Page {currentBook.currentPage} of {currentBook.totalPages} · {pagesLeft} pages left
                    </Text>
                    <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: borderColor }}>
                      <View 
                        className="h-full rounded-full" 
                        style={{ 
                          backgroundColor: accentColor,
                          width: `${progressPercentage}%`
                        }} 
                      />
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <Pressable 
                      onPress={() => router.push(`/reading-session?bookId=${currentBook.id}`)}
                      className="flex-1 py-3 rounded-lg items-center"
                      style={({ pressed }) => [{ 
                        backgroundColor: accentColor,
                        opacity: pressed ? 0.8 : 1
                      }]}
                    >
                      <Text className="text-sm font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                        Resume Reading
                      </Text>
                    </Pressable>
                    
                    <Pressable 
                      onPress={() => console.log('Add Note')}
                      className="flex-1 py-3 rounded-lg items-center"
                      style={({ pressed }) => [{ 
                        backgroundColor: borderColor,
                        opacity: pressed ? 0.7 : 1
                      }]}
                    >
                      <Text className="text-sm font-bold" style={{ color: textColor }}>
                        Add Note
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          )}

          {/* Reading Notes */}
          {currentBook && notes && notes.length > 0 && (
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Notes</Text>
              <View className="gap-2">
                {notes.slice(0, 3).map((note) => (
                  <View 
                    key={note.id} 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: cardBg }}
                  >
                    <Text className="text-xs mb-1" style={{ color: mutedColor }}>Page {note.pageNumber}</Text>
                    <Text className="text-sm leading-relaxed" style={{ color: textColor }}>{note.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Up Next */}
          {queueBooks.length > 0 && (
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Up Next</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                <View className="flex-row gap-3">
                {queueBooks.map((book, index) => (
                  <Pressable 
                    key={book.id}
                    onPress={() => router.push(`/reading-session?bookId=${book.id}`)}
                    className="p-3 rounded-xl"
                    style={({ pressed }) => [{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      opacity: pressed ? 0.7 : 1,
                      width: 140,
                    }]}
                  >
                    {book.coverUrl ? (
                      <Image
                        source={{ uri: book.coverUrl }}
                        style={{ 
                          width: 116,
                          height: 174,
                          borderRadius: 8,
                          marginBottom: 8,
                          backgroundColor: borderColor 
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ 
                        width: 116,
                        height: 174,
                        borderRadius: 8,
                        marginBottom: 8,
                        backgroundColor: borderColor,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{ fontSize: 32 }}>📚</Text>
                      </View>
                    )}
                    <Text className="text-xs font-bold mb-1" style={{ color: textColor }} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text className="text-xs" style={{ color: mutedColor }} numberOfLines={1}>
                      {book.author}
                    </Text>
                    <Text className="text-xs mt-2" style={{ color: accentColor }}>
                      Tap to start →
                    </Text>
                  </Pressable>
                ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Weekly Volume Chart */}
          <View className="px-6">
            <Text className="text-xl font-bold mb-3" style={{ color: textColor }}>Weekly Volume</Text>
            <View 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View className="flex-row items-end justify-between h-32">
                {weeklyVolume.map((pages, index) => {
                  const maxPages = Math.max(...weeklyVolume, 1);
                  const heightPercentage = (pages / maxPages) * 100;
                  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                  
                  return (
                    <View key={index} className="flex-1 items-center">
                      <View 
                        className="w-8 rounded-t-lg mb-2" 
                        style={{ 
                          backgroundColor: accentColor,
                          height: `${Math.max(heightPercentage, 5)}%`,
                          opacity: pages === 0 ? 0.2 : 1
                        }} 
                      />
                      <Text className="text-xs" style={{ color: mutedColor }}>{days[index]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Log Session Modal */}
      {currentBook && (
        <LogSessionModal
          visible={showLogModal}
          onClose={() => setShowLogModal(false)}
          bookId={currentBook.id}
          bookTitle={currentBook.title}
          currentPage={currentBook.currentPage}
          totalPages={currentBook.totalPages}
          onSessionLogged={async (endPage) => {
            // Update book progress
            await updateBook.mutateAsync({
              id: currentBook.id,
              currentPage: endPage,
            });
            // Refetch data
            await handleRefresh();
          }}
        />
      )}

      {/* Book Picker Modal */}
      <BookPickerModal
        visible={showBookPicker}
        onClose={() => setShowBookPicker(false)}
        books={books || []}
        onSelectBook={(book) => {
          setShowBookPicker(false);
          router.push(`/reading-session?bookId=${book.id}`);
        }}
      />
    </ScreenContainer>
  );
}
