import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Camera,
  Send,
  Info,
  RefreshCw,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import type { Message } from "@/types";

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View
      className={`max-w-[80%] mb-3 ${isOwn ? "self-end" : "self-start"}`}
    >
      <View
        className={`px-4 py-3 shadow-sm ${
          isOwn
            ? "bg-primary rounded-2xl rounded-br-sm"
            : "bg-surface-container-highest rounded-2xl rounded-bl-sm"
        }`}
      >
        {message.text && (
          <Text
            className={`text-sm leading-relaxed font-inter font-medium ${
              isOwn ? "text-white" : "text-on-surface"
            }`}
          >
            {message.text}
          </Text>
        )}
        {message.image_url && (
          <View className="rounded-xl overflow-hidden mt-1">
            <Image
              source={{ uri: message.image_url }}
              className="w-52 h-36"
              resizeMode="cover"
            />
          </View>
        )}
      </View>
      <Text
        className={`text-[10px] text-outline mt-1 px-1 font-inter ${
          isOwn ? "text-right" : "text-left"
        }`}
      >
        {formatTime(message.created_at)}
      </Text>
    </View>
  );
}

export default function ChatScreen() {
  const { id: otherUserId } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { messages, partner, isLoading, error, sendMessage, refresh } =
    useMessages(user?.id, otherUserId);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [input, sendMessage]);

  const partnerName = partner?.full_name ?? "User";
  const partnerFirstName = partnerName.split(" ")[0];

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#32632e" />
        <Text className="font-inter text-sm text-on-surface-variant mt-4">
          Loading conversation...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
          <RefreshCw color="#a03f29" size={32} />
        </View>
        <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
          {error}
        </Text>
        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-surface-container-highest px-6 py-3 rounded-full active:opacity-80"
          >
            <Text className="text-on-surface font-inter font-semibold">
              Go Back
            </Text>
          </Pressable>
          <Pressable
            onPress={refresh}
            className="bg-primary px-6 py-3 rounded-full active:opacity-90"
          >
            <Text className="text-white font-inter font-semibold">
              Try Again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="bg-surface/95 border-b border-outline-variant/10 px-4 pb-3 flex-row items-center gap-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="p-2 rounded-full active:bg-surface-container-high"
        >
          <ArrowLeft color="#32632e" size={22} />
        </Pressable>
        <View className="flex-row items-center gap-3 flex-1">
          {partner?.avatar_url ? (
            <Image
              source={{ uri: partner.avatar_url }}
              className="w-10 h-10 rounded-full border-2 border-primary-container"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-surface-container-highest items-center justify-center border-2 border-primary-container">
              <Text className="font-manrope font-bold text-primary">
                {partnerFirstName.charAt(0)}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="font-manrope font-bold text-on-surface text-lg leading-tight">
              {partnerFirstName}
            </Text>
            <Text className="text-[11px] font-medium text-primary uppercase tracking-wide font-inter">
              Usually responds within 1 hour
            </Text>
          </View>
        </View>
      </View>

      {/* Context Banner */}
      <View className="mx-4 mt-3 mb-1 px-4 py-2.5 bg-surface-container-low rounded-xl flex-row items-center gap-2">
        <Info color="#32632e" size={16} />
        <Text className="text-sm font-medium text-on-surface font-inter">
          Direct message
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.sender_id === user?.id} />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="font-inter text-sm text-on-surface-variant text-center">
              No messages yet.{"\n"}Say hello to {partnerFirstName}!
            </Text>
          </View>
        }
        ListHeaderComponent={
          messages.length > 0 ? (
            <View className="items-center mb-4">
              <View className="px-4 py-1 bg-surface-container-high rounded-full">
                <Text className="text-[10px] font-bold text-outline uppercase tracking-widest font-inter">
                  Today
                </Text>
              </View>
            </View>
          ) : null
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Input Bar */}
      <View
        className="bg-surface/95 border-t border-outline-variant/10 px-4 pt-3 flex-row items-center gap-3"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable className="w-11 h-11 items-center justify-center bg-surface-container-high rounded-full active:bg-surface-container-highest">
          <Camera color="#49454f" size={22} />
        </Pressable>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={`Message ${partnerFirstName}...`}
          placeholderTextColor="#7a757f"
          className="flex-1 bg-surface-container-low rounded-full py-3 px-5 text-sm font-inter font-medium text-on-surface"
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          className="w-11 h-11 items-center justify-center bg-primary rounded-full shadow-md active:opacity-90"
        >
          <Send color="#ffffff" size={18} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
