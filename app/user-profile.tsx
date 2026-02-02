import { useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function UserProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [refreshing, setRefreshing] = useState(false);
  
  const userIdNum = userId ? parseInt(userId) : 0;
  
  // Follow/unfollow state
  const { data: isFollowing, refetch: refetchFollowing } = trpc.social.isFollowing.useQuery(
    { userId: userIdNum },
    { enabled: userIdNum > 0 }
  );
  const { data: followerCount = 0, refetch: refetchFollowerCount } = trpc.social.getFollowerCount.useQuery(
    { userId: userIdNum },
    { enabled: userIdNum > 0 }
  );
  const { data: followingCount = 0, refetch: refetchFollowingCount } = trpc.social.getFollowingCount.useQuery(
    { userId: userIdNum },
    { enabled: userIdNum > 0 }
  );
  
  const followMutation = trpc.social.followUser.useMutation();
  const unfollowMutation = trpc.social.unfollowUser.useMutation();
  
  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync({ userId: userIdNum });
    } else {
      await followMutation.mutateAsync({ userId: userIdNum });
    }
    await Promise.all([refetchFollowing(), refetchFollowerCount()]);
  };
  
  // Fetch user data
  const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = trpc.stats.get.useQuery(
    undefined,
    { enabled: false } // We'll implement getUserStats endpoint
  );
  
  const { data: userBooks, isLoading: booksLoading, refetch: refetchBooks } = trpc.books.list.useQuery();
  const { data: userPosts, isLoading: postsLoading, refetch: refetchPosts } = trpc.social.posts.useQuery({ limit: 10 });
  
  const isLoading = statsLoading || booksLoading || postsLoading;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchBooks(), refetchPosts(), refetchFollowing(), refetchFollowerCount(), refetchFollowingCount()]);
    setRefreshing(false);
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !refreshing) {
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
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Pressable
            onPress={() => router.back()}
            className="mb-4"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-base" style={{ color: colors.primary }}>
              ← Back
            </Text>
          </Pressable>
          
          {/* User Info */}
          <View className="items-center mb-6">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-3xl font-bold" style={{ color: colors.background }}>
                {getInitials("User")}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-1">
              User Profile
            </Text>
            <Text className="text-sm text-muted mb-3">
              Member since 2024
            </Text>
            
            {/* Follow/Unfollow Button */}
            <Pressable
              onPress={handleFollowToggle}
              className="px-6 py-2 rounded-full"
              style={{
                backgroundColor: isFollowing ? colors.surface : colors.primary,
                borderWidth: isFollowing ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <Text
                className="font-semibold"
                style={{ color: isFollowing ? colors.foreground : colors.background }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
            
            {/* Follower/Following Counts */}
            <View className="flex-row gap-4 mt-4">
              <View className="items-center">
                <Text className="text-lg font-bold text-foreground">{followerCount}</Text>
                <Text className="text-xs text-muted">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-foreground">{followingCount}</Text>
                <Text className="text-xs text-muted">Following</Text>
              </View>
            </View>
          </View>
          
          {/* Stats Grid */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-2xl font-bold text-foreground mb-1">
                {userBooks?.length || 0}
              </Text>
              <Text className="text-xs text-muted">Books</Text>
            </View>
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-2xl font-bold text-foreground mb-1">
                {userStats?.totalPagesRead || 0}
              </Text>
              <Text className="text-xs text-muted">Pages Read</Text>
            </View>
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-2xl font-bold text-foreground mb-1">
                {userPosts?.length || 0}
              </Text>
              <Text className="text-xs text-muted">Posts</Text>
            </View>
          </View>
        </View>
        
        {/* User's Books */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            📚 Reading List
          </Text>
          {userBooks && userBooks.length > 0 ? (
            <View className="gap-3">
              {userBooks.slice(0, 5).map((book: any) => (
                <View
                  key={book.id}
                  className="flex-row rounded-xl p-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  {book.coverUrl ? (
                    <Image
                      source={{ uri: book.coverUrl }}
                      className="w-12 h-18 rounded-lg mr-3"
                      style={{ backgroundColor: colors.border }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      className="w-12 h-18 rounded-lg mr-3 items-center justify-center"
                      style={{ backgroundColor: colors.border }}
                    >
                      <Text className="text-2xl">📖</Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground mb-1" numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text className="text-xs text-muted">{book.author}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-xl p-6 items-center" style={{ backgroundColor: colors.surface }}>
              <Text className="text-sm text-muted">No books yet</Text>
            </View>
          )}
        </View>
        
        {/* User's Recent Posts */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-foreground mb-3">
            💬 Recent Activity
          </Text>
          {userPosts && userPosts.length > 0 ? (
            <View className="gap-3">
              {userPosts.slice(0, 3).map((item: any) => (
                <View
                  key={item.post.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm text-foreground mb-2">
                    {item.post.content}
                  </Text>
                  {item.book && (
                    <View className="px-2 py-1 rounded-lg self-start" style={{ backgroundColor: colors.border }}>
                      <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                        📖 {item.book.title}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-xl p-6 items-center" style={{ backgroundColor: colors.surface }}>
              <Text className="text-sm text-muted">No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
