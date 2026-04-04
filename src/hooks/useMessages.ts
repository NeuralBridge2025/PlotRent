import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/types";
import {
  fetchMessages,
  sendMessage as sendMessageService,
  fetchChatPartner,
} from "@/services/messageService";

interface ChatPartner {
  full_name: string | null;
  avatar_url: string | null;
}

interface UseMessagesResult {
  messages: Message[];
  partner: ChatPartner | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMessages(
  currentUserId: string | undefined,
  otherUserId: string | undefined
): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!currentUserId || !otherUserId) {
      setIsLoading(false);
      setError("Missing user information");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [messagesData, partnerData] = await Promise.all([
        fetchMessages(currentUserId, otherUserId),
        fetchChatPartner(otherUserId),
      ]);
      setMessages(messagesData);
      setPartner(partnerData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentUserId || !otherUserId) return;

      try {
        const newMsg = await sendMessageService(
          currentUserId,
          otherUserId,
          text
        );
        setMessages((prev) => [...prev, newMsg]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to send message";
        setError(message);
      }
    },
    [currentUserId, otherUserId]
  );

  return { messages, partner, isLoading, error, sendMessage, refresh: load };
}
