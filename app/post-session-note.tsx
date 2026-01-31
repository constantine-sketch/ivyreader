import { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function PostSessionNoteScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const bookId = parseInt(params.bookId as string);
  const bookTitle = params.bookTitle as string;
  const bookAuthor = params.bookAuthor as string;
  const durationMinutes = parseInt(params.durationMinutes as string);
  
  // Initialize with passed values, allow user to edit
  const [startPage, setStartPage] = useState(params.startPage as string || "");
  const [endPage, setEndPage] = useState(params.endPage as string || "");
  const [takeaways, setTakeaways] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const createSession = trpc.sessions.create.useMutation();
  const updateBook = trpc.books.update.useMutation();
  const createNote = trpc.notes.create.useMutation();
  
  const pagesRead = parseInt(endPage) - parseInt(startPage);
  
  const handleSaveSession = async () => {
    const startPageNum = parseInt(startPage);
    const endPageNum = parseInt(endPage);
    
    if (!startPage || !endPage || isNaN(startPageNum) || isNaN(endPageNum)) {
      alert("Please enter valid page numbers");
      return;
    }
    
    if (endPageNum < startPageNum) {
      alert("End page must be greater than or equal to start page");
      return;
    }

    if (isNaN(bookId) || bookId <= 0) {
      alert("Invalid book ID");
      return;
    }

    // Ensure duration is at least 1 minute
    const validDuration = Math.max(1, durationMinutes || 1);
    
    try {
      setIsSaving(true);
      
      console.log('Saving session:', { bookId, startPageNum, endPageNum, validDuration });
      
      // Create reading session
      await createSession.mutateAsync({
        bookId,
        startPage: startPageNum,
        endPage: endPageNum,
        durationMinutes: validDuration,
      });
      
      // Update book's current page
      await updateBook.mutateAsync({
        id: bookId,
        currentPage: endPageNum,
      });
      
      // Save takeaways as note if provided
      if (takeaways.trim()) {
        await createNote.mutateAsync({
          bookId,
          content: takeaways,
          pageNumber: endPageNum,
        });
      }
      
      console.log('Session saved successfully, navigating to dashboard');
      // Navigate back to dashboard
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Failed to save session:", error);
      const errorMessage = error?.message || "Unknown error";
      alert(`Failed to save session: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSkip = () => {
    router.replace("/(tabs)");
  };
  
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Session Complete!</Text>
            <Text className="text-base text-muted">Record your progress and key insights</Text>
          </View>
          
          {/* Book Info */}
          <View className="p-4 rounded-xl mb-6" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1 tracking-wider" style={{ color: colors.primary }}>
              READING SESSION
            </Text>
            <Text className="text-lg font-bold text-foreground mb-1">{bookTitle}</Text>
            <Text className="text-sm text-muted mb-2">{bookAuthor}</Text>
            <Text className="text-xs text-muted">Duration: {durationMinutes} minutes</Text>
          </View>
          
          {/* Page Numbers */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Pages Read
            </Text>
            <View className="flex-row gap-3">
              {/* Start Page */}
              <View className="flex-1">
                <Text className="text-xs text-muted mb-2">START PAGE</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  value={startPage}
                  onChangeText={setStartPage}
                  keyboardType="number-pad"
                  className="p-4 rounded-lg text-foreground text-center text-xl font-bold"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>
              
              {/* Arrow */}
              <View className="justify-center items-center pt-6">
                <Text className="text-2xl text-muted">→</Text>
              </View>
              
              {/* End Page */}
              <View className="flex-1">
                <Text className="text-xs text-muted mb-2">END PAGE</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  value={endPage}
                  onChangeText={setEndPage}
                  keyboardType="number-pad"
                  className="p-4 rounded-lg text-foreground text-center text-xl font-bold"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>
            
            {/* Pages Read Display */}
            {!isNaN(pagesRead) && pagesRead >= 0 && (
              <View className="mt-3 p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-center text-sm font-semibold" style={{ color: colors.primary }}>
                  {pagesRead} pages read
                </Text>
              </View>
            )}
          </View>
          
          {/* Takeaways Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Personal Takeaways
            </Text>
            <Text className="text-xs text-muted mb-3">
              What did you learn? Any key insights, quotes, or reflections?
            </Text>
            <TextInput
              placeholder="Write your thoughts here... (optional)"
              placeholderTextColor={colors.muted}
              value={takeaways}
              onChangeText={setTakeaways}
              multiline
              numberOfLines={6}
              className="p-4 rounded-lg text-foreground"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                color: colors.foreground,
                fontFamily: "System",
                fontSize: 14,
                textAlignVertical: "top",
                minHeight: 120,
              }}
            />
          </View>
          
          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-auto">
            <Pressable
              onPress={handleSkip}
              disabled={isSaving}
              className="flex-1 py-4 rounded-lg items-center"
              style={({ pressed }) => [
                {
                  backgroundColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-sm font-bold text-foreground">
                Skip
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleSaveSession}
              disabled={isSaving}
              className="flex-1 py-4 rounded-lg items-center"
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed || isSaving ? 0.8 : 1,
                },
              ]}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Text className="text-sm font-bold" style={{ color: colors.background }}>
                  Save Session
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
