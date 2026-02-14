import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface PublishModalProps {
  visible: boolean;
  onClose: () => void;
  preselectedBookId?: number;
}

export function PublishModal({ visible, onClose, preselectedBookId }: PublishModalProps) {
  const colors = useColors();
  const [content, setContent] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(preselectedBookId || null);
  const [rating, setRating] = useState<number | null>(null);
  const [showBookPicker, setShowBookPicker] = useState(false);

  // Fetch user's books
  const { data: books } = trpc.books.list.useQuery();

  // Mutation for creating post
  const createPost = trpc.social.createPost.useMutation();
  const utils = trpc.useUtils();

  const selectedBook = books?.find((b: any) => b.id === selectedBookId);

  const handlePublish = async () => {
    if (!content.trim()) {
      alert("Please write something to publish");
      return;
    }

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        bookId: selectedBookId || undefined,
        rating: rating || undefined,
      });

      // Reset form
      setContent("");
      setSelectedBookId(null);
      setRating(null);

      // Invalidate social feed to show new post
      await utils.social.posts.invalidate();

      onClose();
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Failed to publish. Please try again.");
    }
  };

  const handleClose = () => {
    setContent("");
    setSelectedBookId(preselectedBookId || null);
    setRating(null);
    setShowBookPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Pressable className="flex-1" onPress={handleClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          style={{ maxHeight: "85%" }}
        >
          <View
            className="rounded-t-3xl flex-1"
            style={{
              backgroundColor: colors.background,
            }}
          >
            {/* Header */}
            <View
              className="flex-row justify-between items-center p-4 border-b"
              style={{ borderBottomColor: colors.border }}
            >
              <Pressable onPress={handleClose}>
                <Text style={{ color: colors.muted }}>Cancel</Text>
              </Pressable>
              <Text className="text-lg font-bold text-foreground">
                Publish
              </Text>
              <Pressable
                onPress={handlePublish}
                disabled={createPost.isPending || !content.trim()}
                style={{
                  opacity: createPost.isPending || !content.trim() ? 0.5 : 1,
                }}
              >
                {createPost.isPending ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={{ color: colors.primary, fontWeight: "600" }}>
                    Post
                  </Text>
                )}
              </Pressable>
            </View>

            <ScrollView
              className="flex-1 p-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Content Input */}
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Share your thoughts, insights, or progress..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="p-4 rounded-lg text-foreground mb-4"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  minHeight: 120,
                  fontSize: 16,
                }}
              />

              {/* Book Selection */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Attach a Book (Optional)
                </Text>
                
                {selectedBook ? (
                  <View
                    className="flex-row items-center p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                    }}
                  >
                    {selectedBook.coverUrl ? (
                      <Image
                        source={{ uri: selectedBook.coverUrl }}
                        style={{
                          width: 40,
                          height: 60,
                          borderRadius: 4,
                          marginRight: 12,
                          backgroundColor: colors.border,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 60,
                          borderRadius: 4,
                          marginRight: 12,
                          backgroundColor: colors.border,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>📚</Text>
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                        {selectedBook.title}
                      </Text>
                      <Text className="text-xs text-muted" numberOfLines={1}>
                        {selectedBook.author}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setSelectedBookId(null)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <Text style={{ color: colors.error, fontSize: 20 }}>×</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setShowBookPicker(!showBookPicker)}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <Text style={{ color: colors.primary, textAlign: "center" }}>
                      + Select a Book
                    </Text>
                  </Pressable>
                )}

                {/* Book Picker Dropdown */}
                {showBookPicker && !selectedBook && (
                  <View
                    className="mt-2 rounded-lg border overflow-hidden"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      maxHeight: 200,
                    }}
                  >
                    <ScrollView>
                      {books?.map((book: any) => (
                        <Pressable
                          key={book.id}
                          onPress={() => {
                            setSelectedBookId(book.id);
                            setShowBookPicker(false);
                          }}
                          className="flex-row items-center p-3"
                          style={({ pressed }) => ({
                            backgroundColor: pressed ? colors.border : "transparent",
                          })}
                        >
                          {book.coverUrl ? (
                            <Image
                              source={{ uri: book.coverUrl }}
                              style={{
                                width: 30,
                                height: 45,
                                borderRadius: 4,
                                marginRight: 12,
                                backgroundColor: colors.border,
                              }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View
                              style={{
                                width: 30,
                                height: 45,
                                borderRadius: 4,
                                marginRight: 12,
                                backgroundColor: colors.border,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ fontSize: 16 }}>📚</Text>
                            </View>
                          )}
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                              {book.title}
                            </Text>
                            <Text className="text-xs text-muted" numberOfLines={1}>
                              {book.author}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Rating (only if book selected) */}
              {selectedBook && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Rate this Book (Optional)
                  </Text>
                  <View className="flex-row gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable
                        key={star}
                        onPress={() => setRating(star === rating ? null : star)}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.6 : 1,
                        })}
                      >
                        <Text style={{ fontSize: 32 }}>
                          {rating && star <= rating ? "⭐" : "☆"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
