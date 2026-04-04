import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useNotifications } from "@/hooks/useNotifications";

function RootNavigator() {
  useNotifications();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role-select" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="plot/[id]" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="create-plot" />
        <Stack.Screen name="services" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}
