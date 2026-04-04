import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { Flower, Mountain } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Onboarding() {
  const { isAuthenticated, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  // Entrance animations
  const headlineOpacity = useSharedValue(0);
  const headlineTranslateY = useSharedValue(24);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(24);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)");
      return;
    }

    // Staggered entrance
    headlineOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    headlineTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    buttonsOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    buttonsTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    footerOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [
    isLoading,
    isAuthenticated,
    headlineOpacity,
    headlineTranslateY,
    buttonsOpacity,
    buttonsTranslateY,
    footerOpacity,
  ]);

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ translateY: headlineTranslateY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <Text className="text-on-surface-variant text-base font-inter">
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" testID="onboarding-screen">
      <LinearGradient
        colors={["rgba(50, 99, 46, 0.85)", "rgba(28, 28, 25, 0.95)"]}
        locations={[0, 0.7]}
        className="flex-1"
      >
        {/* Top Branding */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          className="items-center"
          style={{ paddingTop: insets.top + 32 }}
        >
          <Text className="font-manrope text-3xl font-black text-white tracking-tighter opacity-90">
            PlotRent
          </Text>
        </Animated.View>

        {/* Spacer to push content down */}
        <View className="flex-1" />

        {/* Content area at bottom */}
        <View
          className="px-6"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          {/* Headline Group */}
          <Animated.View style={headlineStyle} className="mb-8">
            <Text className="font-manrope text-4xl font-extrabold text-white leading-tight tracking-tight">
              Find your patch{"\n"}of earth
            </Text>
            <Text className="font-inter text-lg text-white/80 mt-4 leading-relaxed max-w-[85%]">
              Rent a garden plot near you. Grow your own food. Connect with your
              community through soil and sun.
            </Text>
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View style={buttonsStyle} className="gap-4 mb-8">
            <AnimatedPressable
              onPress={() => router.replace("/(tabs)")}
              testID="onboarding-grow-button"
              accessibilityRole="button"
              accessibilityLabel="I want to grow — find garden plots to rent"
              className="rounded-full bg-primary shadow-2xl active:opacity-90"
            >
              <View className="h-14 flex-row items-center justify-center gap-3">
                <Flower color="#ffffff" size={20} />
                <Text className="font-inter text-base font-bold text-white">
                  I want to grow
                </Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => router.replace("/(tabs)/host")}
              testID="onboarding-share-button"
              accessibilityRole="button"
              accessibilityLabel="I have land to share — list your garden plots"
              className="rounded-full bg-secondary shadow-xl active:opacity-90"
            >
              <View className="h-14 flex-row items-center justify-center gap-3">
                <Mountain color="#ffffff" size={20} />
                <Text className="font-inter text-base font-bold text-white">
                  I have land to share
                </Text>
              </View>
            </AnimatedPressable>
          </Animated.View>

          {/* Social Auth */}
          <Animated.View style={footerStyle}>
            {/* Divider */}
            <View className="flex-row items-center gap-4 mb-6">
              <View className="flex-1 h-px bg-white/20" />
              <Text className="text-white/40 text-xs uppercase tracking-widest font-inter">
                or sign in with
              </Text>
              <View className="flex-1 h-px bg-white/20" />
            </View>

            {/* Social buttons */}
            <View className="flex-row gap-4 mb-6">
              <Pressable className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10">
                <Text className="text-white font-inter font-medium">
                  Google
                </Text>
              </Pressable>
              <Pressable className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10">
                <Text className="text-white font-inter font-medium">
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text className="text-white/30 text-[10px] uppercase tracking-tight text-center leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </Text>
          </Animated.View>
        </View>

        {/* Decorative blur circle */}
        <View className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      </LinearGradient>
    </View>
  );
}
