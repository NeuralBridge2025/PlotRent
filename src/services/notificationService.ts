import * as Notifications from "expo-notifications";
import * as Device from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

/**
 * Configure default notification behavior.
 */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request push notification permissions and return the Expo push token.
 * Returns null if permissions are denied or unavailable.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.default.isDevice) {
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not already granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "PlotRent",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#32632e",
    });
  }

  // Get the Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Device.default.expoConfig?.extra?.eas?.projectId,
  });

  return tokenData.data;
}

/**
 * Save the push token to the user's profile in Supabase.
 * Stores in a metadata field so the backend can send notifications.
 */
export async function savePushToken(
  userId: string,
  token: string
): Promise<void> {
  // We store the token via auth user metadata since profiles
  // don't have a push_token column (add via migration if needed)
  const { error } = await supabase.auth.updateUser({
    data: { push_token: token },
  });

  if (error) {
    console.warn("Failed to save push token:", error.message);
  }
}
