import { useState, useEffect, useCallback } from "react";
import { AppState } from "react-native";

/**
 * Lightweight network status hook.
 * Checks connectivity by attempting a HEAD request to the Supabase URL.
 * Re-checks when the app comes to the foreground.
 */
export function useNetworkStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(true);

  const check = useCallback(async () => {
    try {
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!url) {
        setIsOnline(true);
        return;
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(`${url}/rest/v1/`, {
        method: "HEAD",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }, []);

  // Check on mount
  useEffect(() => {
    check();
  }, [check]);

  // Re-check when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        check();
      }
    });

    return () => subscription.remove();
  }, [check]);

  return { isOnline };
}
