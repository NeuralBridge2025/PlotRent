import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import {
  configureNotifications,
  registerForPushNotifications,
  savePushToken,
} from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that registers for push notifications and handles
 * incoming notification taps (deep linking).
 * Should be called once in the root layout.
 */
export function useNotifications(): void {
  const { user } = useAuth();
  const responseListener =
    useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Configure handler on mount
    configureNotifications();
  }, []);

  // Register token when user signs in
  useEffect(() => {
    if (!user) return;

    registerForPushNotifications().then((token) => {
      if (token) {
        savePushToken(user.id, token);
      }
    });
  }, [user]);

  // Handle notification taps (deep linking)
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // Route based on notification type
        if (data?.type === "message" && data?.chatUserId) {
          router.push(`/chat/${data.chatUserId}`);
        } else if (data?.type === "booking" && data?.plotId) {
          router.push(`/plot/${data.plotId}`);
        }
      });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
}
