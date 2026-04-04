import { useState, useEffect, useCallback } from "react";
import type { Conversation } from "@/types";
import { fetchConversations } from "@/services/messageService";

interface UseConversationsResult {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useConversations(
  userId: string | undefined
): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      setError("Not signed in");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchConversations(userId);
      setConversations(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load conversations";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { conversations, isLoading, error, refresh: load };
}
