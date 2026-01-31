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
  const pagesRead = parseInt(params.pagesRead as string);
  const bookTitle = params.bookTitle as string;
  const bookAuthor = params.bookAuthor as string;
  
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const createNote = trpc.notes.create.useMutation();
  
  const handleSaveNote = async () => {
    if (!note.trim()) {
      // Allow empty notes - just go back
      router.replace("/(tabs)");
      return;
    }
    
    try {
      setIsSaving(true);
      await createNote.mutateAsync({
        bookId,
        content: note,
        pageNumber: parseInt(params.endPage as string) || 0,
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to save note:", error);
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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">Great Session!</Text>
            <Text className="text-base text-muted">You read {pagesRead} pages</Text>
          </View>
          
          {/* Book Info */}
          <View className="p-4 rounded-xl mb-8" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xs mb-1 tracking-wider" style={{ color: colors.primary }}>
              CURRENTLY READING
            </Text>
            <Text className="text-lg font-bold text-foreground mb-1">{bookTitle}</Text>
            <Text className="text-sm text-muted">{bookAuthor}</Text>
          </View>
          
          {/* Note Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Capture Your Thoughts
            </Text>
            <Text className="text-xs text-muted mb-3">
              Write down key insights, quotes, or reflections from this session
            </Text>
            <TextInput
              placeholder="What stood out to you? Any key takeaways?"
              placeholderTextColor={colors.muted}
              value={note}
              onChangeText={setNote}
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
              onPress={handleSaveNote}
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
                  Save Note
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
