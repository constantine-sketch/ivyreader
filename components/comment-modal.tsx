import React, { useState } from "react";
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
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { formatTimeAgo } from "@/lib/mock-data";

interface CommentModalProps {
  visible: boolean;
  postId: number;
  onClose: () => void;
}

export function CommentModal({ visible, postId, onClose }: CommentModalProps) {
  const colors = useColors();
  const [commentText, setCommentText] = useState("");

  // Fetch comments for this post
  const { data: comments, isLoading, refetch } = trpc.social.comments.useQuery(
    { postId },
    { enabled: visible }
  );

  // Mutations
  const createComment = trpc.social.createComment.useMutation();
  const deleteComment = trpc.social.deleteComment.useMutation();
  const { data: currentUser } = trpc.auth.me.useQuery();
  
  const handleDeleteComment = async (commentId: number, commentUserId: number) => {
    // Only allow deleting own comments
    if (currentUser?.id !== commentUserId) return;
    
    if (Platform.OS === 'web') {
      if (!confirm('Delete this comment?')) return;
    } else {
      const { Alert } = await import('react-native');
      await new Promise<void>((resolve, reject) => {
        Alert.alert(
          'Delete Comment',
          'Are you sure you want to delete this comment?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => reject() },
            { text: 'Delete', style: 'destructive', onPress: () => resolve() },
          ]
        );
      }).catch(() => { throw new Error('Cancelled'); });
    }
    
    try {
      await deleteComment.mutateAsync({ commentId });
      await refetch();
    } catch (error: any) {
      if (error.message !== 'Cancelled') {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment.mutateAsync({
        postId,
        content: commentText.trim(),
      });
      setCommentText("");
      await refetch();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          style={{ flex: 1, maxHeight: "90%" }}
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
              <Text className="text-xl font-bold text-foreground">Comments</Text>
              <Pressable onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  Done
                </Text>
              </Pressable>
            </View>

            {/* Comments List */}
            <ScrollView className="flex-1 p-4">
              {isLoading ? (
                <View className="items-center justify-center py-8">
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <Pressable
                    key={comment.id}
                    onLongPress={() => handleDeleteComment(comment.id, comment.userId)}
                    className="mb-4"
                  >
                    <View className="flex-row items-start">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: colors.background }}
                        >
                          {getInitials(comment.userName || "U")}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text className="text-sm font-bold text-foreground mr-2">
                            {comment.userName || "User"}
                          </Text>
                          <Text className="text-xs text-muted">
                            {formatTimeAgo(new Date(comment.createdAt))}
                          </Text>
                          {currentUser?.id === comment.userId && (
                            <Text className="text-xs ml-auto" style={{ color: colors.error }}>
                              Hold to delete
                            </Text>
                          )}
                        </View>
                        <Text className="text-sm text-foreground leading-relaxed">
                          {comment.content}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))
              ) : (
                <View className="items-center justify-center py-8">
                  <Text className="text-muted">No comments yet. Be the first!</Text>
                </View>
              )}
            </ScrollView>

            {/* Comment Input */}
            <View
              className="p-4 border-t"
              style={{ borderTopColor: colors.border }}
            >
              <View className="flex-row items-end gap-2">
                <TextInput
                  placeholder="Write a comment..."
                  placeholderTextColor={colors.muted}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                  className="flex-1 p-3 rounded-xl"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.foreground,
                    maxHeight: 100,
                  }}
                />
                <Pressable
                  onPress={handleSubmitComment}
                  disabled={!commentText.trim() || createComment.isPending}
                  className="px-4 py-3 rounded-xl"
                  style={({ pressed }) => [
                    {
                      backgroundColor: commentText.trim()
                        ? colors.primary
                        : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  {createComment.isPending ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <Text
                      className="font-bold"
                      style={{ color: colors.background }}
                    >
                      Post
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
