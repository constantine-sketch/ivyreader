import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { 
  getGreeting,
  formatDate,
  formatDuration
} from "@/lib/mock-data";

export default function DashboardScreen() {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  
  // Fetch real data from API
  const { data: stats, isLoading: statsLoading } = trpc.stats.get.useQuery();
  const { data: books, isLoading: booksLoading } = trpc.books.list.useQuery();
  const { data: sessions } = trpc.sessions.listByUser.useQuery({ limit: 7 });
  
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
  
  // Get currently reading book
  const currentBook = books?.find(b => b.status === 'reading');
  const queueBooks = books?.filter(b => b.status === 'queue').slice(0, 3) || [];
  
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
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header Section */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-4xl font-bold text-foreground" style={{ fontFamily: 'System' }}>
            {getGreeting()}.
          </Text>
          <Text className="text-xs text-muted mt-1 tracking-wider">
            {formatDate()}
          </Text>
        </View>

        {/* Daily Goal and Resume Button */}
        <View className="px-6 mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-muted mb-1">DAILY GOAL</Text>
            <Text className="text-2xl font-bold text-foreground">
              {todayMinutes} / {dailyGoal} min
            </Text>
          </View>
          <Pressable 
            onPress={() => console.log('Resume Reading pressed')}
            style={({ pressed }) => [{
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }]}
          >
            <Text className="text-sm font-bold" style={{ color: colors.background }}>
              Resume Reading
            </Text>
          </Pressable>
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
              <Pressable onPress={() => console.log('View Library')}>
                <Text className="text-sm" style={{ color: colors.primary }}>VIEW LIBRARY</Text>
              </Pressable>
            </View>

            <View className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row mb-4">
                {/* Book Cover Placeholder */}
                <View 
                  className="w-20 h-28 rounded-lg mr-4" 
                  style={{ backgroundColor: colors.border }}
                />
                
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
                  onPress={() => console.log('Log Session')}
                  className="flex-1 py-3 rounded-lg items-center"
                  style={({ pressed }) => [{ 
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1
                  }]}
                >
                  <Text className="text-sm font-bold" style={{ color: colors.background }}>
                    Log Session
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
          </View>
        )}

        {/* Up Next */}
        {queueBooks.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-foreground mb-3">Up Next</Text>
            <View className="flex-row gap-3">
              {queueBooks.map((book, index) => (
                <View 
                  key={book.id}
                  className="flex-1 p-3 rounded-xl" 
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="w-full aspect-[2/3] rounded-lg mb-2" style={{ backgroundColor: colors.border }} />
                  <Text className="text-xs font-bold text-foreground mb-1" numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text className="text-xs text-muted" numberOfLines={1}>
                    {book.author}
                  </Text>
                </View>
              ))}
            </View>
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
    </ScreenContainer>
  );
}
