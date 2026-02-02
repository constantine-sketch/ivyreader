import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { formatTimeAgo } from "@/lib/mock-data";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  const colors = useColors();
  
  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery(
    { limit: 50 },
    { enabled: visible }
  );
  
  const markAsRead = trpc.notifications.markAsRead.useMutation();
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation();
  
  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead.mutateAsync({ notificationId });
    await refetch();
  };
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
    await refetch();
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      case "milestone":
        return "🎉";
      default:
        return "📬";
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
        
        <View
          className="rounded-t-3xl"
          style={{
            backgroundColor: colors.background,
            maxHeight: "85%",
          }}
        >
          {/* Header */}
          <View
            className="flex-row justify-between items-center p-4 border-b"
            style={{ borderBottomColor: colors.border }}
          >
            <Text className="text-xl font-bold text-foreground">
              Notifications
            </Text>
            <View className="flex-row gap-3">
              {notifications && notifications.length > 0 && (
                <Pressable
                  onPress={handleMarkAllAsRead}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    Mark All Read
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text className="text-2xl" style={{ color: colors.muted }}>
                  ×
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView className="flex-1 p-4">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-12">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : notifications && notifications.length > 0 ? (
              <View className="gap-3">
                {notifications.map((item: any) => (
                  <Pressable
                    key={item.notification.id}
                    onPress={() => handleMarkAsRead(item.notification.id)}
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: item.notification.isRead ? colors.surface : colors.primary + "15",
                      borderColor: item.notification.isRead ? "transparent" : colors.primary,
                      borderWidth: item.notification.isRead ? 0 : 1,
                    }}
                  >
                    <View className="flex-row items-start">
                      <Text className="text-2xl mr-3">
                        {getNotificationIcon(item.notification.type)}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-foreground mb-1">
                          {item.notification.title}
                        </Text>
                        <Text className="text-sm text-muted mb-2">
                          {item.notification.message}
                        </Text>
                        <Text className="text-xs" style={{ color: colors.muted }}>
                          {formatTimeAgo(new Date(item.notification.createdAt))}
                        </Text>
                      </View>
                      {!item.notification.isRead && (
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-4xl mb-3">🔔</Text>
                <Text className="text-base font-semibold text-foreground mb-2">
                  No Notifications
                </Text>
                <Text className="text-sm text-muted text-center">
                  You're all caught up!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
