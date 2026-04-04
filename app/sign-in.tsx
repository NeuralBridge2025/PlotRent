import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Sprout } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password, fullName.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, fullName, isSignUp, signInWithEmail, signUpWithEmail]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setError(null);
  }, []);

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="px-4 pb-3 flex-row items-center gap-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="p-2 rounded-full active:bg-surface-container-high"
        >
          <ArrowLeft color="#32632e" size={22} />
        </Pressable>
        <Text className="font-manrope text-xl font-bold text-on-surface">
          {isSignUp ? "Create Account" : "Sign In"}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                <Sprout color="#32632e" size={32} />
              </View>
              <Text className="font-manrope text-2xl font-bold text-on-surface text-center">
                {isSignUp ? "Join PlotRent" : "Welcome Back"}
              </Text>
              <Text className="font-inter text-base text-on-surface-variant text-center mt-1">
                {isSignUp
                  ? "Create an account to get started."
                  : "Sign in to your account."}
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              {isSignUp && (
                <View>
                  <Text className="font-inter font-medium text-sm text-on-surface-variant mb-1.5 ml-1">
                    Full Name
                  </Text>
                  <TextInput
                    testID="sign-in-name-input"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Maria Santos"
                    placeholderTextColor="#7a757f"
                    autoCapitalize="words"
                    autoComplete="name"
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-4 font-inter text-base text-on-surface"
                  />
                </View>
              )}

              <View>
                <Text className="font-inter font-medium text-sm text-on-surface-variant mb-1.5 ml-1">
                  Email
                </Text>
                <TextInput
                  testID="sign-in-email-input"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#7a757f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-4 font-inter text-base text-on-surface"
                />
              </View>

              <View>
                <Text className="font-inter font-medium text-sm text-on-surface-variant mb-1.5 ml-1">
                  Password
                </Text>
                <TextInput
                  testID="sign-in-password-input"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor="#7a757f"
                  secureTextEntry
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-4 font-inter text-base text-on-surface"
                />
              </View>
            </View>

            {/* Error */}
            {error && (
              <View testID="sign-in-error" className="mt-4 bg-secondary/10 rounded-2xl px-4 py-3">
                <Text className="font-inter text-sm text-secondary text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <Pressable
              testID="sign-in-submit-button"
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`mt-6 py-5 rounded-full flex-row items-center justify-center ${
                isSubmitting ? "bg-outline/30" : "bg-primary active:opacity-90"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="font-manrope font-extrabold text-lg text-white">
                  {isSignUp ? "Create Account" : "Sign In"}
                </Text>
              )}
            </Pressable>

            {/* Toggle mode */}
            <Pressable testID="sign-in-toggle-mode" onPress={toggleMode} className="mt-5 py-2">
              <Text className="font-inter text-sm text-center text-on-surface-variant">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Text className="font-bold text-primary">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
