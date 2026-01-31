import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { formatTimeAgo } from "@/lib/mock-data";
import { CreatePostModal } from "@/components/create-post-modal";

type FeedTab = 'following' | 'global';

export default function SocietyScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<FeedTab>('global');
  const [postContent, setPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fetch real data from database
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = trpc.social.posts.useQuery({ limit: 20 });
  const { data: leaderboard, isLoading: leaderboardLoading } = trpc.social.leaderboard.useQuery({ limit: 10 });
  const { data: books } = trpc.books.list.useQuery();
  
  // Mutation for creating posts
  const createPost = trpc.social.createPost.useMutation();
  
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
          <Text className="text-3xl font-bold text-foreground mb-4">Society</Text>

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

        <ScrollView className="flex-1">
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
              <View 
                key={item.post.id} 
                className="rounded-2xl p-4 mb-4"
                style={{ backgroundColor: colors.surface }}
              >
                {/* User Info */}
                <View className="flex-row items-center mb-3">
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
                </View>

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
                    onPress={() => console.log('Like post:', item.post.id)}
                    className="flex-row items-center"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-base mr-1">👍</Text>
                    <Text className="text-sm text-muted">{item.post.likes}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => console.log('Comment on post:', item.post.id)}
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
              </View>
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
    </ScreenContainer>
  );
}
