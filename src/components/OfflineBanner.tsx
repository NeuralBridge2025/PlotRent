import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WifiOff } from "lucide-react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

/**
 * Shows a banner at the top of the screen when the device is offline.
 * Animates in/out smoothly.
 */
export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      className="absolute top-0 left-0 right-0 z-50 bg-secondary flex-row items-center justify-center gap-2"
      style={{ paddingTop: insets.top + 4, paddingBottom: 8 }}
    >
      <WifiOff color="#ffffff" size={16} />
      <Text className="font-inter font-semibold text-sm text-white">
        You're offline — some features may be unavailable
      </Text>
    </Animated.View>
  );
}
