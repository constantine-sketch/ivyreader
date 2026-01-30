import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { mockSocialPosts, mockLeaderboard, mockTrendingBooks, formatTimeAgo } from "@/lib/mock-data";

type FeedTab = 'following' | 'global';

export default function SocietyScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<FeedTab>('global');
  const [postContent, setPostContent] = useState('');

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

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
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <TextInput
              placeholder="Share an insight or observation..."
              placeholderTextColor={colors.muted}
              value={postContent}
              onChangeText={setPostContent}
              multiline
              numberOfLines={3}
              className="text-foreground mb-3"
              style={{ 
                color: colors.foreground,
                minHeight: 60,
                textAlignVertical: 'top'
              }}
            />
            <Pressable 
              className="px-4 py-2 rounded-lg self-end"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold text-sm" style={{ color: colors.background }}>
                Publish
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="px-6">
            {/* Social Feed */}
            <View className="mb-6">
              {mockSocialPosts.map((post) => (
                <View key={post.id} className="bg-surface rounded-2xl p-4 border border-border mb-3">
                  {/* User Info */}
                  <View className="flex-row items-center mb-3">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="font-bold" style={{ color: colors.background }}>
                        {getInitials(post.userName)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{post.userName}</Text>
                      <Text className="text-xs text-muted">{formatTimeAgo(post.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Post Content */}
                  <Text className="text-foreground mb-3 leading-relaxed">{post.content}</Text>

                  {/* Book Reference */}
                  {post.bookTitle && (
                    <View 
                      className="bg-background rounded-lg p-3 mb-3"
                      style={{ borderLeftWidth: 3, borderLeftColor: colors.primary }}
                    >
                      <Text className="font-bold text-foreground mb-1">{post.bookTitle}</Text>
                      <Text className="text-sm text-muted">{post.bookAuthor}</Text>
                      {post.rating && (
                        <Text className="text-xs text-muted mt-1">
                          Rated {post.rating}/5
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Engagement */}
                  <View className="flex-row gap-4">
                    <Pressable className="flex-row items-center gap-2">
                      <Text className="text-muted">♥</Text>
                      <Text className="text-sm text-muted">{post.likes}</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center gap-2">
                      <Text className="text-muted">💬</Text>
                      <Text className="text-sm text-muted">{post.comments}</Text>
                    </Pressable>
                    <Pressable>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        Share
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            {/* Top Readers Leaderboard */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-bold text-foreground">Top Readers (This Week)</Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                {mockLeaderboard.map((entry) => (
                  <View 
                    key={entry.userId} 
                    className="flex-row items-center justify-between py-3"
                    style={{ 
                      borderBottomWidth: entry.rank < mockLeaderboard.length ? 1 : 0,
                      borderBottomColor: colors.border
                    }}
                  >
                    <View className="flex-row items-center flex-1">
                      <Text 
                        className="font-bold mr-3"
                        style={{ 
                          color: entry.rank <= 3 ? colors.primary : colors.muted,
                          fontSize: 16
                        }}
                      >
                        #{entry.rank}
                      </Text>
                      <Text className="text-foreground font-medium">{entry.userName}</Text>
                    </View>
                    <Text className="text-sm text-muted">{entry.pagesRead} pgs</Text>
                  </View>
                ))}
                <Pressable className="mt-3">
                  <Text className="text-center text-xs font-semibold tracking-wider" style={{ color: colors.primary }}>
                    VIEW FULL LEADERBOARD
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Trending Books */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground mb-3">Trending in Society</Text>
              {mockTrendingBooks.map((book) => (
                <Pressable 
                  key={book.bookId}
                  className="bg-surface rounded-xl p-4 border border-border mb-3"
                >
                  <Text className="text-base font-bold text-foreground mb-1">{book.title}</Text>
                  <Text className="text-sm text-muted mb-2">{book.author}</Text>
                  <Text className="text-xs text-muted">{book.activeReaders} active readers</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
