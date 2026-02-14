import { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, RefreshControl, Platform, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { formatTimeAgo } from "@/lib/mock-data";
import { CreatePostModal } from "@/components/create-post-modal";
import { CommentModal } from "@/components/comment-modal";
import { NotificationsModal } from "@/components/notifications-modal";
import { useTierAccess } from "@/hooks/use-tier-access";
import { TierBadge } from "@/components/tier-gate";

type FeedTab = 'following' | 'global';

// Mock upcoming Pomodoro sessions
const UPCOMING_SESSIONS = [
  { id: "1", title: "Morning Focus Session", host: "Sarah K.", time: "Today, 9:00 AM", participants: 12, duration: "25 min" },
  { id: "2", title: "Deep Work Hour", host: "Marcus T.", time: "Today, 2:00 PM", participants: 8, duration: "50 min" },
  { id: "3", title: "Evening Reading Sprint", host: "IvyReader Team", time: "Today, 7:00 PM", participants: 24, duration: "25 min" },
];

export default function SocietyScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'following' | 'global'>('global');
  const [postContent, setPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { accentColor, isDarkTheme, isElite, isPremiumOrHigher } = useTierAccess();
  
  // Animation for Pomodoro card
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isElite) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isElite]);
  
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
  
  // Theme colors
  const bgColor = isDarkTheme ? "#0a0a0a" : colors.background;
  const cardBg = isDarkTheme ? "#151515" : colors.surface;
  const borderColor = isDarkTheme ? "#333" : colors.border;
  const textColor = isDarkTheme ? "#fff" : colors.foreground;
  const mutedColor = isDarkTheme ? "#888" : colors.muted;
  const goldAccent = "#FFD700";

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={accentColor} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName={isDarkTheme ? "bg-[#0a0a0a]" : "bg-background"}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold mr-3" style={{ color: textColor }}>Society</Text>
              <TierBadge size="small" />
            </View>
            <View className="flex-row gap-3">
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
                    <Text className="text-xs font-bold" style={{ color: "#fff" }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
            />
          }
        >
          {/* Elite Pomodoro Group Calls - Prominent Section */}
          {isElite && (
            <View className="px-6 mb-6">
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View 
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: `${goldAccent}10`,
                    borderWidth: 2,
                    borderColor: goldAccent,
                  }}
                >
                  {/* Header */}
                  <View className="p-4 flex-row items-center justify-between" style={{ backgroundColor: `${goldAccent}15` }}>
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 28, marginRight: 10 }}>🎯</Text>
                      <View>
                        <Text className="text-lg font-bold" style={{ color: textColor }}>
                          Pomodoro Group Calls
                        </Text>
                        <Text className="text-xs" style={{ color: goldAccent }}>
                          ELITE EXCLUSIVE
                        </Text>
                      </View>
                    </View>
                    <View 
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.success }}
                    >
                      <Text className="text-xs font-bold" style={{ color: "#fff" }}>
                        LIVE NOW
                      </Text>
                    </View>
                  </View>
                  
                  {/* Upcoming Sessions */}
                  <View className="p-4">
                    <Text className="text-xs font-bold tracking-widest mb-3" style={{ color: mutedColor }}>
                      UPCOMING SESSIONS
                    </Text>
                    
                    {UPCOMING_SESSIONS.map((session, index) => (
                      <TouchableOpacity
                        key={session.id}
                        onPress={() => router.push('/pomodoro-sessions')}
                        className="flex-row items-center justify-between py-3"
                        style={{
                          borderBottomWidth: index < UPCOMING_SESSIONS.length - 1 ? 1 : 0,
                          borderBottomColor: `${goldAccent}30`,
                        }}
                      >
                        <View className="flex-1">
                          <Text className="font-semibold" style={{ color: textColor }}>
                            {session.title}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs" style={{ color: mutedColor }}>
                              {session.time} • {session.duration}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <View className="flex-row items-center">
                            <Text className="text-xs mr-1" style={{ color: goldAccent }}>
                              {session.participants}
                            </Text>
                            <Text style={{ fontSize: 12 }}>👥</Text>
                          </View>
                          <Text className="text-xs" style={{ color: mutedColor }}>
                            Hosted by {session.host}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Join Button */}
                    <TouchableOpacity
                      onPress={() => router.push('/pomodoro-sessions')}
                      className="mt-4 py-3 rounded-xl items-center"
                      style={{ backgroundColor: goldAccent }}
                    >
                      <Text className="font-bold" style={{ color: "#000" }}>
                        Join a Session →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          )}

          {/* Tabs */}
          <View className="px-6 mb-4">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setActiveTab('following')}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: activeTab === 'following' ? accentColor : cardBg,
                  borderWidth: 1,
                  borderColor: activeTab === 'following' ? accentColor : borderColor
                }}
              >
                <Text 
                  className="font-semibold text-sm"
                  style={{ color: activeTab === 'following' ? (isDarkTheme ? "#000" : "#fff") : textColor }}
                >
                  FOLLOWING
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('global')}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: activeTab === 'global' ? accentColor : cardBg,
                  borderWidth: 1,
                  borderColor: activeTab === 'global' ? accentColor : borderColor
                }}
              >
                <Text 
                  className="font-semibold text-sm"
                  style={{ color: activeTab === 'global' ? (isDarkTheme ? "#000" : "#fff") : textColor }}
                >
                  GLOBAL
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Post Input */}
          <View className="px-6 mb-6">
            <View 
              className="rounded-2xl p-4"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <TextInput
                placeholder="Share an insight or observation..."
                placeholderTextColor={mutedColor}
                value={postContent}
                onChangeText={setPostContent}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                blurOnSubmit={true}
                className="mb-3"
                style={{ 
                  color: textColor,
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
                  backgroundColor: accentColor,
                  opacity: pressed ? 0.8 : 1
                }]}
              >
                <Text className="font-bold text-sm" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                  PUBLISH
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Leaderboard Widget */}
          <View className="px-6 mb-6">
            <View 
              className="rounded-2xl p-4"
              style={{ 
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
                🏆 Top Readers This Week
              </Text>
              {leaderboard?.map((entry, index) => (
                <View key={entry.userId} className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-lg font-bold mr-3" style={{ color: mutedColor }}>
                      #{index + 1}
                    </Text>
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Text className="text-xs font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                        {getInitials(entry.name || `User ${entry.userId}`)}
                      </Text>
                    </View>
                    <Text className="text-sm font-semibold" style={{ color: textColor }}>
                      {entry.name || `User ${entry.userId}`}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold" style={{ color: accentColor }}>
                    {entry.pagesRead} pages
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social Feed */}
          <View className="px-6 pb-8">
            <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>Feed</Text>
            {posts?.map((item: any) => (
              <Pressable
                key={item.post.id}
                onLongPress={() => handleDeletePost(item.post.id, item.post.userId)}
                className="rounded-2xl p-4 mb-4"
                style={{ 
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                {/* User Info */}
                <Pressable
                  onPress={() => router.push(`/user-profile?userId=${item.post.userId}`)}
                  className="flex-row items-center mb-3"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Text className="text-sm font-bold" style={{ color: isDarkTheme ? "#000" : "#fff" }}>
                      {getInitials(item.user?.name || 'U')}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-semibold" style={{ color: textColor }}>
                        {item.user?.name || 'Anonymous'}
                      </Text>
                      {item.user?.subscriptionTier === 'elite' && (
                        <Text className="ml-1" style={{ fontSize: 12 }}>👑</Text>
                      )}
                    </View>
                    <Text className="text-xs" style={{ color: mutedColor }}>
                      {formatTimeAgo(item.post.createdAt)}
                    </Text>
                  </View>
                </Pressable>

                {/* Post Content */}
                <Text className="mb-3" style={{ color: textColor, lineHeight: 22 }}>
                  {item.post.content}
                </Text>

                {/* Book Reference */}
                {item.book && (
                  <View 
                    className="flex-row items-center p-3 rounded-xl mb-3"
                    style={{ backgroundColor: isDarkTheme ? "#1a1a1a" : `${accentColor}10` }}
                  >
                    <Text className="text-2xl mr-3">📖</Text>
                    <View className="flex-1">
                      <Text className="font-semibold text-sm" style={{ color: textColor }}>
                        {item.book.title}
                      </Text>
                      <Text className="text-xs" style={{ color: mutedColor }}>
                        {item.book.author}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View className="flex-row items-center gap-4">
                  <Pressable
                    onPress={() => handleLikePost(item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-lg mr-1">{'❤️'}</Text>
                    <Text className="text-sm" style={{ color: mutedColor }}>
                      {item.post.likes || 0}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSelectedPostId(item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-lg mr-1">💬</Text>
                    <Text className="text-sm" style={{ color: mutedColor }}>
                      {item.post.likes || 0}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Modals */}
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        books={books || []}
        onPostCreated={async () => { await refetchPosts(); }}
      />
      
      <CommentModal
        visible={selectedPostId !== null}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId || 0}
      />
      
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </ScreenContainer>
  );
}
