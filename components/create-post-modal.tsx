import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: (content: string, bookId?: number) => Promise<void>;
  books?: Array<{ id: number; title: string }>;
}

export function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
  books = [],
}: CreatePostModalProps) {
  const colors = useColors();
  const [content, setContent] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>();
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      await onPostCreated(content.trim(), selectedBookId);
      setContent("");
      setSelectedBookId(undefined);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const charCount = content.length;
  const charLimit = 280;
  const isOverLimit = charCount > charLimit;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          className="flex-1 rounded-t-3xl mt-auto"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-foreground">Share Your Thoughts</Text>
              <Pressable onPress={onClose}>
                <Text className="text-2xl text-muted">✕</Text>
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6 py-4">
            {/* Text Input */}
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="What are you reading? Share your insights..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={charLimit}
              className="rounded-lg px-4 py-3 text-foreground mb-4 h-32"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: isOverLimit ? colors.error : colors.border,
                textAlignVertical: "top",
              }}
            />

            {/* Character Count */}
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-xs"
                style={{
                  color: isOverLimit ? colors.error : colors.muted,
                }}
              >
                {charCount} / {charLimit}
              </Text>
            </View>

            {/* Book Selection */}
            {books.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-bold text-muted mb-2">
                  Reference a book (optional)
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2"
                >
                  {books.map((book) => (
                    <Pressable
                      key={book.id}
                      onPress={() =>
                        setSelectedBookId(selectedBookId === book.id ? undefined : book.id)
                      }
                      className="px-4 py-2 rounded-full"
                      style={{
                        backgroundColor:
                          selectedBookId === book.id ? colors.primary : colors.surface,
                        borderWidth: 1,
                        borderColor:
                          selectedBookId === book.id ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color:
                            selectedBookId === book.id ? colors.background : colors.foreground,
                        }}
                      >
                        {book.title}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 border-t flex-row gap-3" style={{ borderTopColor: colors.border }}>
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-lg items-center"
              style={{ backgroundColor: colors.surface }}
              disabled={isPosting}
            >
              <Text className="text-sm font-bold text-foreground">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handlePost}
              className="flex-1 py-3 rounded-lg items-center"
              style={{
                backgroundColor: isOverLimit || !content.trim() ? colors.muted : colors.primary,
              }}
              disabled={isPosting || isOverLimit || !content.trim()}
            >
              {isPosting ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text className="text-sm font-bold" style={{ color: colors.background }}>
                  Post
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
