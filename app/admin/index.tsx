import { useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

type TabType = "overview" | "users" | "lists" | "metrics";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Check if user is admin
  if (authLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#D4A574" />
      </ScreenContainer>
    );
  }

  if (!user || (user as any).role !== "admin") {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6">
        <Text className="text-6xl mb-4">🔒</Text>
        <Text className="text-2xl font-bold text-foreground mb-2">Access Denied</Text>
        <Text className="text-muted text-center mb-6">
          You need admin privileges to access this page.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "lists", label: "Lists", icon: "📚" },
    { id: "metrics", label: "Metrics", icon: "📈" },
  ];

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
            <Text className="text-muted">Manage IvyReader</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="bg-surface px-4 py-2 rounded-lg"
          >
            <Text className="text-foreground">← Back</Text>
          </Pressable>
        </View>

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex-row items-center gap-2 ${
                  activeTab === tab.id ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text>{tab.icon}</Text>
                <Text
                  className={`font-medium ${
                    activeTab === tab.id ? "text-white" : "text-foreground"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "lists" && <ListsTab />}
        {activeTab === "metrics" && <MetricsTab />}
      </ScrollView>
    </ScreenContainer>
  );
}

function OverviewTab() {
  const { data: userCounts, isLoading: countsLoading } = trpc.admin.userCounts.useQuery();
  const { data: metrics, isLoading: metricsLoading } = trpc.admin.metrics.useQuery();

  if (countsLoading || metricsLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  const stats = [
    { label: "Total Users", value: userCounts?.total || 0, icon: "👥", color: "#D4A574" },
    { label: "Premium", value: userCounts?.premium || 0, icon: "⭐", color: "#22C55E" },
    { label: "Elite", value: userCounts?.elite || 0, icon: "👑", color: "#FFD700" },
    { label: "Verified", value: userCounts?.verified || 0, icon: "✓", color: "#0EA5E9" },
  ];

  const engagementStats = [
    { label: "Total Books", value: metrics?.totalBooks || 0, icon: "📚" },
    { label: "Reading Sessions", value: metrics?.totalSessions || 0, icon: "📖" },
    { label: "Pages Read", value: metrics?.totalPagesRead || 0, icon: "📄" },
    { label: "Active Today", value: metrics?.activeUsersToday || 0, icon: "🔥" },
    { label: "Active This Week", value: metrics?.activeUsersWeek || 0, icon: "📅" },
  ];

  return (
    <View className="gap-6">
      {/* User Stats */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">User Statistics</Text>
        <View className="flex-row flex-wrap gap-4">
          {stats.map((stat) => (
            <View
              key={stat.label}
              className="bg-surface rounded-xl p-4 flex-1 min-w-[140px]"
              style={{ borderLeftWidth: 4, borderLeftColor: stat.color }}
            >
              <Text className="text-2xl mb-1">{stat.icon}</Text>
              <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
              <Text className="text-muted text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Engagement Stats */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">Engagement Metrics</Text>
        <View className="flex-row flex-wrap gap-4">
          {engagementStats.map((stat) => (
            <View
              key={stat.label}
              className="bg-surface rounded-xl p-4 flex-1 min-w-[140px]"
            >
              <Text className="text-2xl mb-1">{stat.icon}</Text>
              <Text className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </Text>
              <Text className="text-muted text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function UsersTab() {
  const { data: users, isLoading, refetch } = trpc.admin.users.useQuery({ limit: 50 });
  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => refetch(),
  });
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "elite":
        return { bg: "#1a1a1a", text: "#FFD700", label: "Elite" };
      case "premium":
        return { bg: "#D4A574", text: "#fff", label: "Premium" };
      default:
        return { bg: "#E5E7EB", text: "#687076", label: "Free" };
    }
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-foreground">
          All Users ({users?.length || 0})
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-surface px-4 py-2 rounded-lg"
        >
          <Text className="text-foreground">🔄 Refresh</Text>
        </Pressable>
      </View>

      {users?.map((user) => {
        const tierBadge = getTierBadge(user.subscriptionTier);
        return (
          <View
            key={user.id}
            className="bg-surface rounded-xl p-4 flex-row items-center gap-4"
          >
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-xl">{user.avatar || "👤"}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-foreground">
                  {user.name || "No name"}
                </Text>
                {user.role === "admin" && (
                  <View className="bg-red-500 px-2 py-0.5 rounded">
                    <Text className="text-white text-xs font-bold">ADMIN</Text>
                  </View>
                )}
              </View>
              <Text className="text-muted text-sm">{user.email || "No email"}</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View
                  style={{ backgroundColor: tierBadge.bg }}
                  className="px-2 py-0.5 rounded"
                >
                  <Text style={{ color: tierBadge.text }} className="text-xs font-medium">
                    {tierBadge.label}
                  </Text>
                </View>
                {user.emailVerified === 1 && (
                  <Text className="text-green-500 text-xs">✓ Verified</Text>
                )}
              </View>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  const newRole = user.role === "admin" ? "user" : "admin";
                  updateRoleMutation.mutate({ userId: user.id, role: newRole });
                }}
                className="bg-blue-500/20 p-2 rounded-lg"
              >
                <Text className="text-blue-500">
                  {user.role === "admin" ? "👤" : "👑"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (confirm(`Delete user ${user.name || user.email}?`)) {
                    deleteUserMutation.mutate({ userId: user.id });
                  }
                }}
                className="bg-red-500/20 p-2 rounded-lg"
              >
                <Text className="text-red-500">🗑️</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function ListsTab() {
  const { data: lists, isLoading } = trpc.admin.curatedLists.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-foreground">
          Curated Reading Lists ({lists?.length || 0})
        </Text>
        <Pressable className="bg-primary px-4 py-2 rounded-lg">
          <Text className="text-white font-medium">+ Add List</Text>
        </Pressable>
      </View>

      {lists?.map((list) => (
        <View
          key={list.id}
          className="bg-surface rounded-xl p-4 flex-row items-center gap-4"
        >
          <View className="w-14 h-14 rounded-xl bg-primary/20 items-center justify-center">
            <Text className="text-2xl">{list.coverEmoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground">{list.title}</Text>
            <Text className="text-muted text-sm">{list.description}</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <Text className="text-muted text-xs">{list.bookCount} books</Text>
              <View
                className={`px-2 py-0.5 rounded ${
                  list.tier === "elite" ? "bg-yellow-500/20" : "bg-primary/20"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    list.tier === "elite" ? "text-yellow-500" : "text-primary"
                  }`}
                >
                  {list.tier === "elite" ? "Elite" : "Premium"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Pressable className="bg-blue-500/20 p-2 rounded-lg">
              <Text className="text-blue-500">✏️</Text>
            </Pressable>
            <Pressable className="bg-red-500/20 p-2 rounded-lg">
              <Text className="text-red-500">🗑️</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View className="bg-surface/50 rounded-xl p-6 items-center border-2 border-dashed border-border">
        <Text className="text-4xl mb-2">📚</Text>
        <Text className="text-muted text-center">
          Curated lists are currently hardcoded.{"\n"}
          Database-backed list management coming soon.
        </Text>
      </View>
    </View>
  );
}

function MetricsTab() {
  const { data: metrics, isLoading } = trpc.admin.metrics.useQuery();
  const { data: userCounts } = trpc.admin.userCounts.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  const conversionRate = userCounts?.total
    ? (((userCounts.premium + userCounts.elite) / userCounts.total) * 100).toFixed(1)
    : "0";

  const avgPagesPerUser = userCounts?.total && metrics?.totalPagesRead
    ? Math.round(metrics.totalPagesRead / userCounts.total)
    : 0;

  return (
    <View className="gap-6">
      {/* Key Metrics */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">Key Performance Indicators</Text>
        <View className="gap-4">
          <View className="bg-surface rounded-xl p-4">
            <Text className="text-muted text-sm">Paid Conversion Rate</Text>
            <Text className="text-3xl font-bold text-green-500">{conversionRate}%</Text>
            <Text className="text-muted text-xs mt-1">
              {(userCounts?.premium || 0) + (userCounts?.elite || 0)} paid / {userCounts?.total || 0} total
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4">
            <Text className="text-muted text-sm">Average Pages per User</Text>
            <Text className="text-3xl font-bold text-primary">{avgPagesPerUser}</Text>
            <Text className="text-muted text-xs mt-1">
              {metrics?.totalPagesRead?.toLocaleString() || 0} total pages read
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4">
            <Text className="text-muted text-sm">Daily Active Users (DAU)</Text>
            <Text className="text-3xl font-bold text-blue-500">{metrics?.activeUsersToday || 0}</Text>
            <Text className="text-muted text-xs mt-1">
              {metrics?.activeUsersWeek || 0} active this week (WAU)
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4">
            <Text className="text-muted text-sm">Email Verification Rate</Text>
            <Text className="text-3xl font-bold text-yellow-500">
              {userCounts?.total
                ? ((userCounts.verified / userCounts.total) * 100).toFixed(1)
                : "0"}%
            </Text>
            <Text className="text-muted text-xs mt-1">
              {userCounts?.verified || 0} verified / {userCounts?.total || 0} total
            </Text>
          </View>
        </View>
      </View>

      {/* Revenue Breakdown */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown (Estimated)</Text>
        <View className="bg-surface rounded-xl p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted">Premium ($27/mo)</Text>
            <Text className="text-foreground font-semibold">
              ${((userCounts?.premium || 0) * 27).toLocaleString()}/mo
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted">Elite ($97/mo)</Text>
            <Text className="text-foreground font-semibold">
              ${((userCounts?.elite || 0) * 97).toLocaleString()}/mo
            </Text>
          </View>
          <View className="border-t border-border pt-2 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-foreground font-bold">Total MRR</Text>
              <Text className="text-green-500 font-bold text-xl">
                ${(((userCounts?.premium || 0) * 27) + ((userCounts?.elite || 0) * 97)).toLocaleString()}/mo
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
