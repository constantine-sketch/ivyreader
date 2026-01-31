import { useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
// Simple date formatter
const formatSessionDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default function BookDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookId = parseInt(params.bookId as string);
  
  const [activeTab, setActiveTab] = useState<"sessions" | "notes">("sessions");
  
  // Fetch book data
  const { data: books, isLoading: booksLoading } = trpc.books.list.useQuery();
  const book = books?.find(b => b.id === bookId);
  
  // Fetch sessions and notes
  const { data: sessions = [], isLoading: sessionsLoading } = trpc.sessions.listByBook.useQuery(
    { bookId },
    { enabled: !!bookId }
  );
  const { data: notes = [], isLoading: notesLoading } = trpc.notes.listByBook.useQuery(
    { bookId },
    { enabled: !!bookId }
  );
  
  const isLoading = booksLoading || sessionsLoading || notesLoading;
  
  if (isLoading || !book) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }
  
  const progressPercentage = Math.round((book.currentPage / book.totalPages) * 100);
  const totalSessions = sessions.length;
  const totalPagesRead = sessions.reduce((sum, s) => sum + (s.endPage - s.startPage), 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-sm" style={{ color: colors.primary }}>← Back</Text>
          </Pressable>
          
          <Pressable
            onPress={() => router.push(`/edit-book?bookId=${bookId}`)}
            className="px-4 py-2 rounded-lg"
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-sm font-bold" style={{ color: colors.background }}>Edit</Text>
          </Pressable>
        </View>
        
        {/* Book Info */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">{book.title}</Text>
          <Text className="text-base text-muted mb-4">{book.author}</Text>
          
          {/* Progress Bar */}
          <View className="mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-muted">PROGRESS</Text>
              <Text className="text-xs font-bold text-foreground">{progressPercentage}%</Text>
            </View>
            <View className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
              <View
                className="h-2 rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  width: `${progressPercentage}%`,
                }}
              />
            </View>
            <Text className="text-xs text-muted mt-2">
              Page {book.currentPage} of {book.totalPages}
            </Text>
          </View>
        </View>
        
        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs text-muted mb-1">SESSIONS</Text>
            <Text className="text-2xl font-bold text-foreground">{totalSessions}</Text>
          </View>
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs text-muted mb-1">PAGES READ</Text>
            <Text className="text-2xl font-bold text-foreground">{totalPagesRead}</Text>
          </View>
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs text-muted mb-1">TIME SPENT</Text>
            <Text className="text-2xl font-bold text-foreground">
              {totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalMinutes}m`}
            </Text>
          </View>
          <View className="flex-1 min-w-[45%] p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs text-muted mb-1">NOTES</Text>
            <Text className="text-2xl font-bold text-foreground">{notes.length}</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View className="flex-row gap-2 mb-4">
          <Pressable
            onPress={() => setActiveTab("sessions")}
            className="flex-1 py-3 rounded-lg items-center"
            style={{
              backgroundColor: activeTab === "sessions" ? colors.primary : colors.surface,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{
                color: activeTab === "sessions" ? colors.background : colors.foreground,
              }}
            >
              Sessions ({totalSessions})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("notes")}
            className="flex-1 py-3 rounded-lg items-center"
            style={{
              backgroundColor: activeTab === "notes" ? colors.primary : colors.surface,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{
                color: activeTab === "notes" ? colors.background : colors.foreground,
              }}
            >
              Notes ({notes.length})
            </Text>
          </Pressable>
        </View>
        
        {/* Content */}
        {activeTab === "sessions" ? (
          <View className="gap-3">
            {sessions.length === 0 ? (
              <View className="p-8 items-center">
                <Text className="text-sm text-muted text-center">
                  No reading sessions yet. Start reading to track your progress!
                </Text>
              </View>
            ) : (
              sessions.map((session) => {
                const pagesRead = session.endPage - session.startPage;
                const sessionDate = new Date(session.createdAt);
                
                return (
                  <View
                    key={session.id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View>
                        <Text className="text-sm font-bold text-foreground mb-1">
                          {formatSessionDate(sessionDate)}
                        </Text>
                        <Text className="text-xs text-muted">
                          Pages {session.startPage} - {session.endPage}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                          {pagesRead} pages
                        </Text>
                        <Text className="text-xs text-muted">
                          {session.durationMinutes} min
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View className="gap-3">
            {notes.length === 0 ? (
              <View className="p-8 items-center">
                <Text className="text-sm text-muted text-center">
                  No notes yet. Add takeaways after your reading sessions!
                </Text>
              </View>
            ) : (
              notes.map((note) => {
                const noteDate = new Date(note.createdAt);
                
                return (
                  <View
                    key={note.id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-xs text-muted">
                        {formatSessionDate(noteDate)} • Page {note.pageNumber}
                      </Text>
                    </View>
                    <Text className="text-sm text-foreground leading-relaxed">
                      {note.content}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
