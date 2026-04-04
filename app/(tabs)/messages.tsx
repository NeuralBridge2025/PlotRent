import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MessageCircle, RefreshCw } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import type { Conversation } from "@/types";

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface ConversationRowProps {
  conversation: Conversation;
  index: number;
}

function ConversationRow({ conversation, index }: ConversationRowProps) {
  const { other_user, last_message, last_message_at, unread_count } =
    conversation;
  const initial = (other_user.name ?? "?").charAt(0).toUpperCase();
  const hasUnread = unread_count > 0;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <Pressable
        onPress={() => router.push(`/chat/${other_user.id}`)}
        className="flex-row items-center px-5 py-4 active:bg-surface-container-low"
        accessibilityRole="button"
        accessibilityLabel={`Chat with ${other_user.name}`}
      >
        {/* Avatar */}
        {other_user.avatar_url ? (
          <Image
            source={{ uri: other_user.avatar_url }}
            className="w-14 h-14 rounded-full border-2 border-primary-container"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-surface-container-highest items-center justify-center border-2 border-primary-container">
            <Text className="font-manrope font-bold text-primary text-lg">
              {initial}
            </Text>
          </View>
        )}

        {/* Name + last message */}
        <View className="flex-1 ml-4 mr-3">
          <Text
            className={`font-manrope text-base leading-tight ${
              hasUnread
                ? "font-bold text-on-surface"
                : "font-semibold text-on-surface"
            }`}
            numberOfLines={1}
          >
            {other_user.name}
          </Text>
          <Text
            className={`font-inter text-sm mt-1 leading-snug ${
              hasUnread
                ? "font-medium text-on-surface"
                : "text-on-surface-variant"
            }`}
            numberOfLines={1}
          >
            {last_message ?? "No messages yet"}
          </Text>
        </View>

        {/* Timestamp + unread badge */}
        <View className="items-end gap-1.5">
          <Text
            className={`font-inter text-xs ${
              hasUnread ? "font-semibold text-primary" : "text-outline"
            }`}
          >
            {formatRelativeTime(last_message_at)}
          </Text>
          {hasUnread && (
            <View className="bg-primary rounded-full min-w-[22px] h-[22px] items-center justify-center px-1.5">
              <Text className="text-white text-[11px] font-bold font-inter">
                {unread_count > 99 ? "99+" : unread_count}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { conversations, isLoading, error, refresh } = useConversations(
    user?.id
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <View
        className="flex-1 bg-surface items-center justify-center px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <MessageCircle color="#32632e" size={32} />
        </View>
        <Text className="font-manrope text-2xl font-bold text-on-surface mb-2">
          Messages
        </Text>
        <Text className="font-inter text-base text-on-surface-variant text-center">
          Sign in to see your messages
        </Text>
      </View>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <View
        className="flex-1 bg-surface items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#32632e" />
        <Text className="font-inter text-sm text-on-surface-variant mt-4">
          Loading conversations...
        </Text>
      </View>
    );
  }

  // Error
  if (error && conversations.length === 0) {
    return (
      <View
        className="flex-1 bg-surface items-center justify-center px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
          <RefreshCw color="#a03f29" size={32} />
        </View>
        <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
          {error}
        </Text>
        <Pressable
          onPress={refresh}
          className="bg-primary px-6 py-3 rounded-full mt-4 active:opacity-90"
        >
          <Text className="text-white font-inter font-semibold">
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="font-manrope text-2xl font-bold text-on-surface">
          Messages
        </Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ConversationRow conversation={item} index={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#32632e"
          />
        }
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
              <MessageCircle color="#32632e" size={32} />
            </View>
            <Text className="font-manrope text-xl font-bold text-on-surface mb-2">
              No messages yet
            </Text>
            <Text className="font-inter text-sm text-on-surface-variant text-center mb-6">
              Start a conversation by booking a plot
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-primary px-6 py-3 rounded-full active:opacity-90"
            >
              <Text className="text-white font-inter font-semibold">
                Browse Plots
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}
