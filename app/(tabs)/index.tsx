import { ScrollView, Text, View, Pressable, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { 
  mockCurrentBook, 
  mockQueueBooks, 
  mockUserStats, 
  mockWeeklyVolume,
  getGreeting,
  formatDate,
  formatDuration
} from "@/lib/mock-data";

export default function DashboardScreen() {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  
  const progressPercentage = Math.round((mockCurrentBook.currentPage / mockCurrentBook.totalPages) * 100);
  const pagesLeft = mockCurrentBook.totalPages - mockCurrentBook.currentPage;
  const streakComparison = mockUserStats.currentStreak - mockUserStats.averageStreak;
  const totalTimeFormatted = formatDuration(mockUserStats.totalTimeInvestedMinutes);

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
              {mockUserStats.todayMinutes} / {mockUserStats.dailyGoalMinutes} min
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
            <Text className="font-semibold" style={{ color: colors.background }}>
              Resume Reading
            </Text>
          </Pressable>
        </View>

        {/* Stats Cards Grid */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3 mb-3">
            {/* Current Streak */}
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-success mb-1">
                {streakComparison > 0 ? `+${streakComparison}` : streakComparison} days vs avg
              </Text>
              <Text className="text-xs text-muted mb-2">CURRENT STREAK</Text>
              <Text className="text-3xl font-bold text-foreground">
                {mockUserStats.currentStreak} Days
              </Text>
            </View>

            {/* Pages Read */}
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-success mb-1">
                +15% vs Q3
              </Text>
              <Text className="text-xs text-muted mb-2">PAGES READ (Q4)</Text>
              <Text className="text-3xl font-bold text-foreground">
                {mockUserStats.pagesReadQuarterly.toLocaleString()}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            {/* Focus Score */}
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">
                Top {100 - mockUserStats.percentileRanking}% of users
              </Text>
              <Text className="text-xs text-muted mb-2">FOCUS SCORE</Text>
              <Text className="text-3xl font-bold text-foreground">
                {mockUserStats.focusScore}
              </Text>
            </View>

            {/* Time Invested */}
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">
                1.2h daily avg
              </Text>
              <Text className="text-xs text-muted mb-2">TIME INVESTED</Text>
              <Text className="text-3xl font-bold text-foreground">
                {totalTimeFormatted}
              </Text>
            </View>
          </View>
        </View>

        {/* Currently Reading Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold text-foreground">Currently Reading</Text>
            <Pressable onPress={() => console.log('View Library pressed')}>
              <Text className="text-xs font-semibold tracking-wider" style={{ color: colors.primary }}>
                VIEW LIBRARY
              </Text>
            </Pressable>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row mb-3">
              {/* Book Cover Placeholder */}
              <View className="w-24 h-36 bg-border rounded-lg mr-4" />
              
              <View className="flex-1">
                <View className="px-2 py-1 rounded mb-2 self-start" style={{ backgroundColor: colors.primary + '20' }}>
                  <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                    {mockCurrentBook.category.toUpperCase()}
                  </Text>
                </View>
                <Text className="text-xs text-success mb-1">{progressPercentage}% Complete</Text>
                <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={2}>
                  {mockCurrentBook.title}
                </Text>
                <Text className="text-sm text-muted">{mockCurrentBook.author}</Text>
              </View>
            </View>

            {/* Progress Info */}
            <View className="mb-3">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-muted">
                  Page {mockCurrentBook.currentPage} of {mockCurrentBook.totalPages}
                </Text>
                <Text className="text-xs text-muted">
                  {pagesLeft} pages left
                </Text>
              </View>
              {/* Progress Bar */}
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.primary 
                  }} 
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable 
                onPress={() => console.log('Log Session pressed')}
                style={({ pressed }) => [{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <Text className="text-center font-semibold text-foreground">Log Session</Text>
              </Pressable>
              <Pressable 
                onPress={() => console.log('Add Note pressed')}
                style={({ pressed }) => [{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <Text className="text-center font-semibold text-foreground">Add Note</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Up Next Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold text-foreground">Up Next</Text>
            <Pressable onPress={() => console.log('Manage Queue pressed')}>
              <Text className="text-xs font-semibold tracking-wider" style={{ color: colors.primary }}>
                MANAGE QUEUE
              </Text>
            </Pressable>
          </View>

          {mockQueueBooks.map((book) => (
            <View key={book.id} className="bg-surface rounded-xl p-4 border border-border mb-3">
              <Text className="text-base font-bold text-foreground mb-1">{book.title}</Text>
              <Text className="text-sm text-muted mb-2">{book.author}</Text>
              <View className="px-2 py-1 rounded self-start" style={{ backgroundColor: colors.muted + '20' }}>
                <Text className="text-xs text-muted">{book.category.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Volume Chart */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-3">Weekly Volume</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-end justify-between h-32 mb-2">
              {mockWeeklyVolume.map((day, index) => {
                const maxMinutes = Math.max(...mockWeeklyVolume.map(d => d.minutes));
                const heightPercentage = (day.minutes / maxMinutes) * 100;
                
                return (
                  <View key={index} className="flex-1 items-center justify-end">
                    <View 
                      className="w-8 rounded-t"
                      style={{ 
                        height: `${heightPercentage}%`,
                        backgroundColor: colors.primary,
                        minHeight: 8
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <View className="flex-row justify-between mb-3">
              {mockWeeklyVolume.map((day, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-xs text-muted">{day.day}</Text>
                </View>
              ))}
            </View>
            <View className="border-t border-border pt-3">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">TOTAL</Text>
                <Text className="text-sm font-bold text-foreground">
                  {mockWeeklyVolume.reduce((sum, day) => sum + day.minutes, 0)} Minutes
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
