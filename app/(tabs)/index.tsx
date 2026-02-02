import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator, Image, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { LogSessionModal } from "@/components/log-session-modal";
import { BookPickerModal } from "@/components/book-picker-modal";

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

  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch real data from API
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.stats.get.useQuery();
  const { data: books, isLoading: booksLoading, refetch: refetchBooks } = trpc.books.list.useQuery();
  const { data: sessions, refetch: refetchSessions } = trpc.sessions.listByUser.useQuery({ limit: 7 });
  
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
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
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

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header Section */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-4xl font-bold text-foreground" style={{ fontFamily: 'System' }}>
            {getGreeting()}.
          </Text>
          <Text className="text-xs text-muted mt-1 tracking-wider">
            {formatDate()}
          </Text>
        </View>

        {/* Daily Goal and Action Buttons */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs text-muted mb-1">DAILY GOAL</Text>
              <Text className="text-2xl font-bold text-foreground">
                {todayMinutes} / {dailyGoal} min
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setShowBookPicker(true)}
              className="flex-1 items-center justify-center"
              style={({ pressed }) => [{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              }]}
            >
              <Text className="text-sm font-bold" style={{ color: colors.background }}>
                Resume Reading
              </Text>
            </Pressable>

          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-6 flex-row flex-wrap gap-3">
          {/* Current Streak */}
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1" style={{ color: colors.primary }}>
              {streakComparison >= 0 ? `+${streakComparison}` : streakComparison} days vs avg
            </Text>
            <Text className="text-xs text-muted mb-2">CURRENT STREAK</Text>
            <Text className="text-3xl font-bold text-foreground">
              {stats?.currentStreak || 0} Days
            </Text>
          </View>

          {/* Pages Read */}
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1" style={{ color: colors.primary }}>
              +15% vs Q3
            </Text>
            <Text className="text-xs text-muted mb-2">PAGES READ (Q4)</Text>
            <Text className="text-3xl font-bold text-foreground">
              {stats?.totalPagesRead?.toLocaleString() || 0}
            </Text>
          </View>

          {/* Focus Score */}
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1 text-muted">Top 5% of users</Text>
            <Text className="text-xs text-muted mb-2">FOCUS SCORE</Text>
            <Text className="text-3xl font-bold text-foreground">
              {focusScore}
            </Text>
          </View>

          {/* Time Invested */}
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1 text-muted">1.2h daily avg</Text>
            <Text className="text-xs text-muted mb-2">TIME INVESTED</Text>
            <Text className="text-3xl font-bold text-foreground">
              {totalTimeFormatted}
            </Text>
          </View>
        </View>

        {/* Currently Reading */}
        {currentBook && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xl font-bold text-foreground">Currently Reading</Text>
              <Pressable onPress={() => router.push('/(tabs)/library')}>
                <Text className="text-sm" style={{ color: colors.primary }}>VIEW LIBRARY</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push(`/book-detail?bookId=${currentBook.id}`)}
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
              }]}
            >
              <View className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row mb-4">
                  {/* Book Cover */}
                  {currentBook.coverUrl ? (
                    <Image
                      source={{ uri: currentBook.coverUrl }}
                      className="w-20 h-28 rounded-lg mr-4"
                      style={{ backgroundColor: colors.border }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View 
                      className="w-20 h-28 rounded-lg mr-4 items-center justify-center" 
                      style={{ backgroundColor: colors.border }}
                    >
                      <Text className="text-4xl">📚</Text>
                    </View>
                  )}
                  
                  <View className="flex-1">
                    <Text className="text-xs mb-1 tracking-wider" style={{ color: colors.primary }}>
                      {currentBook.category?.toUpperCase()}
                    </Text>
                    <Text className="text-xs mb-1" style={{ color: colors.primary }}>
                      {progressPercentage}% Complete
                    </Text>
                    <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={2}>
                      {currentBook.title}
                    </Text>
                    <Text className="text-sm text-muted">{currentBook.author}</Text>
                  </View>
                </View>

              {/* Progress Info */}
              <View className="mb-3">
                <Text className="text-xs text-muted mb-2">
                  Page {currentBook.currentPage} of {currentBook.totalPages} · {pagesLeft} pages left
                </Text>
                <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                  <View 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: colors.primary,
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
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1
                  }]}
                >
                  <Text className="text-sm font-bold" style={{ color: colors.background }}>
                    Resume Reading
                  </Text>
                </Pressable>
                
                <Pressable 
                  onPress={() => console.log('Add Note')}
                  className="flex-1 py-3 rounded-lg items-center"
                  style={({ pressed }) => [{ 
                    backgroundColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }]}
                >
                  <Text className="text-sm font-bold text-foreground">
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
            <Text className="text-xl font-bold text-foreground mb-3">Notes</Text>
            <View className="gap-2">
              {notes.slice(0, 3).map((note) => (
                <View key={note.id} className="p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
                  <Text className="text-xs text-muted mb-1">Page {note.pageNumber}</Text>
                  <Text className="text-sm text-foreground leading-relaxed">{note.content}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Up Next */}
        {queueBooks.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-foreground mb-3">Up Next</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              <View className="flex-row gap-3">
              {queueBooks.map((book, index) => (
                <Pressable 
                  key={book.id}
                  onPress={() => router.push(`/reading-session?bookId=${book.id}`)}
                  className="p-3 rounded-xl"
                  style={({ pressed }) => [{
                    backgroundColor: colors.surface,
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
                        backgroundColor: colors.border 
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ 
                      width: 116,
                      height: 174,
                      borderRadius: 8,
                      marginBottom: 8,
                      backgroundColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ fontSize: 32 }}>📚</Text>
                    </View>
                  )}
                  <Text className="text-xs font-bold text-foreground mb-1" numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text className="text-xs text-muted" numberOfLines={1}>
                    {book.author}
                  </Text>
                  <Text className="text-xs mt-2" style={{ color: colors.primary }}>
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
          <Text className="text-xl font-bold text-foreground mb-3">Weekly Volume</Text>
          <View className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
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
                        backgroundColor: colors.primary,
                        height: `${Math.max(heightPercentage, 5)}%`,
                        opacity: pages === 0 ? 0.2 : 1
                      }} 
                    />
                    <Text className="text-xs text-muted">{days[index]}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Log Session Modal */}
      {currentBook && (
        <LogSessionModal
          visible={showLogModal}
          onClose={() => setShowLogModal(false)}
          bookId={currentBook.id}
          bookTitle={currentBook.title}
          currentPage={currentBook.currentPage}
          totalPages={currentBook.totalPages}
          onSessionLogged={async (startPage: number, endPage: number, duration: number) => {
            // Create the session in database
            await createSession.mutateAsync({
              bookId: currentBook.id,
              startPage,
              endPage,
              durationMinutes: duration,
            });
            
            // Update book's current page
            await updateBook.mutateAsync({
              id: currentBook.id,
              currentPage: endPage,
            });
            
            // Refresh all data to show updated stats
            await refetchStats();
            await refetchBooks();
            await refetchSessions();
          }}
        />
      )}

      {/* Book Picker Modal */}
      <BookPickerModal
        visible={showBookPicker}
        books={books || []}
        onClose={() => setShowBookPicker(false)}
        onSelectBook={(book) => {
          router.push(`/reading-session?bookId=${book.id}`);
        }}
      />


    </ScreenContainer>
  );
}
