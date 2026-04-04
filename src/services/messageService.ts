import { supabase } from "@/lib/supabase";
import type { Message, Conversation } from "@/types";

/**
 * Fetch messages between the current user and another user, newest last.
 */
export async function fetchMessages(
  currentUserId: string,
  otherUserId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)")
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => {
    const sender = (row as Record<string, unknown>).sender as {
      full_name: string | null;
      avatar_url: string | null;
    } | null;

    const { sender: _, ...messageFields } = row as typeof row & {
      sender: unknown;
    };

    return {
      ...messageFields,
      sender_name: sender?.full_name ?? undefined,
      sender_avatar: sender?.avatar_url ?? undefined,
    } as Message;
  });
}

/**
 * Send a text message.
 */
export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      text,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    ...data,
    sender_name: undefined,
    sender_avatar: undefined,
  } as Message;
}

/**
 * Fetch conversation list for a user (distinct partners with last message).
 */
export async function fetchConversations(
  userId: string
): Promise<Conversation[]> {
  const { data, error } = await supabase.rpc("get_conversations", {
    p_user_id: userId,
  });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => ({
    id: row.conversation_id,
    other_user: {
      id: row.other_user_id,
      name: row.other_user_name ?? "Unknown",
      avatar_url: row.other_user_avatar,
    },
    last_message: row.last_message,
    last_message_at: row.last_message_at,
    unread_count: Number(row.unread_count),
    plot_title: null,
  }));
}

/**
 * Fetch the other user's profile for the chat header.
 */
export async function fetchChatPartner(
  userId: string
): Promise<{ full_name: string | null; avatar_url: string | null } | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}
