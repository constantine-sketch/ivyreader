import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { AuthWrapper } from "@/components/auth-wrapper";
import { trpc } from "@/lib/trpc";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;
  
  // Get user tier for conditional tab display
  const { data: user } = trpc.auth.me.useQuery();
  const isElite = user?.subscriptionTier === "elite";

  return (
    <AuthWrapper>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: isElite ? "#FFD700" : colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: isElite ? "#0a0a0a" : colors.background,
          borderTopColor: isElite ? "#333" : colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="books.vertical.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reading-lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color}) => <IconSymbol size={28} name="list.bullet.rectangle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="concierge"
        options={{
          href: null, // Hide from tab bar - accessed via Profile
        }}
      />
      <Tabs.Screen
        name="accountability"
        options={{
          title: "Accountability",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="society"
        options={{
          title: "Society",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      </Tabs>
    </AuthWrapper>
  );
}
