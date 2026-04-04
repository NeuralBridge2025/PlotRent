import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function DevLoginScreen() {
  const { email, password } = useLocalSearchParams<{
    email: string;
    password: string;
  }>();
  const { signInWithEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !password) {
      setError("Missing email or password params");
      return;
    }

    signInWithEmail(email, password)
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Sign in failed";
        setError(message);
      });
  }, [email, password, signInWithEmail]);

  return (
    <View className="flex-1 bg-surface items-center justify-center px-6">
      {error ? (
        <Text className="font-inter text-secondary text-base text-center">
          {error}
        </Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="#32632e" />
          <Text className="font-inter text-sm text-on-surface-variant mt-4">
            Signing in...
          </Text>
        </>
      )}
    </View>
  );
}
