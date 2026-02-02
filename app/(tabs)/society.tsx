import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, RefreshControl, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { formatTimeAgo } from "@/lib/mock-data";
import { CreatePostModal } from "@/components/create-post-modal";
import { CommentModal } from "@/components/comment-modal";
import { NotificationsModal } from "@/components/notifications-modal";

type FeedTab = 'following' | 'global';

export default function SocietyScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'following' | 'global'>('global');
  const [postContent, setPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery();
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchPosts();
    setRefreshing(false);
  };

  // Fetch real data from database
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = trpc.social.posts.useQuery({ 
    limit: 20,
    followingOnly: activeTab === 'following'
  });
  const { data: leaderboard, isLoading: leaderboardLoading } = trpc.social.leaderboard.useQuery({ limit: 10 });
  const { data: books } = trpc.books.list.useQuery();
  
  // Mutations for social interactions
  const createPost = trpc.social.createPost.useMutation();
  const likePost = trpc.social.likePost.useMutation();
  const deletePost = trpc.social.deletePost.useMutation();
  const { data: currentUser } = trpc.auth.me.useQuery();
  
  const handleLikePost = async (postId: number) => {
    try {
      await likePost.mutateAsync({ postId });
      await refetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  
  const handleDeletePost = async (postId: number, postUserId: number) => {
    // Only allow deleting own posts
    if (currentUser?.id !== postUserId) return;
    
    if (Platform.OS === 'web') {
      if (!confirm('Delete this post?')) return;
    } else {
      const { Alert } = await import('react-native');
      await new Promise<void>((resolve, reject) => {
        Alert.alert(
          'Delete Post',
          'Are you sure you want to delete this post?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => reject() },
            { text: 'Delete', style: 'destructive', onPress: () => resolve() },
          ]
        );
      }).catch(() => { throw new Error('Cancelled'); });
    }
    
    try {
      await deletePost.mutateAsync({ postId });
      await refetchPosts();
    } catch (error: any) {
      if (error.message !== 'Cancelled') {
        console.error('Failed to delete post:', error);
      }
    }
  };
  
  const isLoading = postsLoading || leaderboardLoading;

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-3xl font-bold text-foreground">Society</Text>
            <View className="flex-row gap-3">
              {/* Elite Pomodoro Button */}
              {currentUser?.subscriptionTier === 'elite' && (
                <Pressable
                  onPress={() => router.push('/pomodoro-sessions')}
                  className="px-3 py-1.5 rounded-full flex-row items-center gap-1"
                  style={({ pressed }) => [{
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1
                  }]}
                >
                  <Text className="text-base">⏱️</Text>
                  <Text className="text-xs font-bold" style={{ color: colors.background }}>
                    Pomodoro
                  </Text>
                </Pressable>
              )}
              
              {/* Notifications */}
              <Pressable
                onPress={() => setShowNotifications(true)}
                className="relative"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text className="text-2xl">🔔</Text>
                {unreadCount > 0 && (
                  <View
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.error }}
                  >
                    <Text className="text-xs font-bold" style={{ color: colors.background }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={() => setActiveTab('following')}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'following' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: activeTab === 'following' ? colors.background : colors.foreground }}
              >
                FOLLOWING
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('global')}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'global' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: activeTab === 'global' ? colors.background : colors.foreground }}
              >
                GLOBAL
              </Text>
            </Pressable>
          </View>

          {/* Post Input */}
          <View className="rounded-2xl p-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <TextInput
              placeholder="Share an insight or observation..."
              placeholderTextColor={colors.muted}
              value={postContent}
              onChangeText={setPostContent}
              multiline
              numberOfLines={3}
              returnKeyType="done"
              blurOnSubmit={true}
              className="mb-3"
              style={{ 
                color: colors.foreground,
                minHeight: 60,
                textAlignVertical: 'top'
              }}
            />
            <Pressable
              onPress={() => {
                console.log('Publish post:', postContent);
                setPostContent('');
              }}
              className="py-2 px-4 rounded-lg self-end"
              style={({ pressed }) => [{ 
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1
              }]}
            >
              <Text className="font-bold text-sm" style={{ color: colors.background }}>
                PUBLISH
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Leaderboard Widget */}
          <View className="px-6 mb-6">
            <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-lg font-bold text-foreground mb-3">
                🏆 Top Readers This Week
              </Text>
              {leaderboard?.map((entry, index) => (
                <View key={entry.userId} className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-lg font-bold mr-3" style={{ color: colors.muted }}>
                      #{index + 1}
                    </Text>
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-xs font-bold" style={{ color: colors.background }}>
                        {getInitials(entry.name || `User ${entry.userId}`)}
                      </Text>
                    </View>
                    <Text className="text-sm font-semibold text-foreground">
                      {entry.name || `User ${entry.userId}`}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                    {entry.pagesRead} pages
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social Feed */}
          <View className="px-6 pb-8">
            <Text className="text-lg font-bold text-foreground mb-3">Feed</Text>
            {posts?.map((item) => (
              <Pressable
                key={item.post.id}
                onLongPress={() => handleDeletePost(item.post.id, item.post.userId)}
                className="rounded-2xl p-4 mb-4"
                style={{ backgroundColor: colors.surface }}
              >
                {/* User Info */}
                <Pressable
                  onPress={() => router.push(`/user-profile?userId=${item.post.userId}`)}
                  className="flex-row items-center mb-3"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-sm font-bold" style={{ color: colors.background }}>
                      {getInitials(item.user?.name || `User ${item.post.userId}`)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground">
                      {item.user?.name || `User ${item.post.userId}`}
                    </Text>
                    <Text className="text-xs text-muted">
                      {formatTimeAgo(new Date(item.post.createdAt))}
                    </Text>
                  </View>
                </Pressable>

                {/* Book Reference */}
                {item.book && (
                  <View className="px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: colors.border }}>
                    <Text className="text-xs font-semibold mb-1" style={{ color: colors.primary }}>
                      {item.book.category.toUpperCase()}
                    </Text>
                    <Text className="text-sm font-bold text-foreground">
                      {item.book.title}
                    </Text>
                    <Text className="text-xs text-muted">{item.book.author}</Text>
                  </View>
                )}

                {/* Post Content */}
                <Text className="text-sm text-foreground mb-3">
                  {item.post.content}
                </Text>

                {/* Actions */}
                <View className="flex-row gap-4 pt-2 border-t" style={{ borderTopColor: colors.border }}>
                  <Pressable
                    onPress={() => handleLikePost(item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-base mr-1">👍</Text>
                    <Text className="text-sm text-muted">{item.post.likes}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSelectedPostId(item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-base mr-1">💬</Text>
                    <Text className="text-sm text-muted">{(item as any).comments || 0}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => console.log('Share post:', item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-base mr-1">🔗</Text>
                    <Text className="text-sm text-muted">Share</Text>
                  </Pressable>
                </View>
                
                {/* Delete hint for own posts */}
                {currentUser?.id === item.post.userId && (
                  <Text className="text-xs mt-2" style={{ color: colors.error }}>
                    Hold to delete
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Floating Create Post Button */}
      <Pressable
        onPress={() => setShowCreatePost(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={({ pressed }) => [{
          backgroundColor: colors.primary,
          opacity: pressed ? 0.8 : 1,
        }]}
      >
        <Text className="text-2xl">+</Text>
      </Pressable>
      
      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={async (content, bookId) => {
          await createPost.mutateAsync({
            content,
            bookId: bookId || undefined,
            rating: undefined,
          });
          await refetchPosts();
        }}
        books={books?.filter(b => b.status === 'reading') || []}
      />
      
      {/* Comment Modal */}
      {selectedPostId && (
        <CommentModal
          visible={selectedPostId !== null}
          postId={selectedPostId}
          onClose={() => {
            setSelectedPostId(null);
            refetchPosts(); // Refresh to update comment counts
          }}
        />
      )}
      
      {/* Notifications Modal */}
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </ScreenContainer>
  );
}
