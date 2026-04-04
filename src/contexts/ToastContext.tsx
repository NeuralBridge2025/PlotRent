import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

type ToastType = "success" | "error" | "info";

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "#32632e", text: "#ffffff" },
  error: { bg: "#ba1a1a", text: "#ffffff" },
  info: { bg: "#1c1b18", text: "#ffffff" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const translateY = useSharedValue(-100);

  const hideToast = useCallback(() => {
    translateY.value = withTiming(-100, { duration: 300 });
    setTimeout(() => setToast(null), 300);
  }, [translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      setToast({ message, type });
      translateY.value = withSequence(
        withTiming(0, { duration: 300 }),
        withDelay(
          3000,
          withTiming(-100, { duration: 300 }, () => {
            runOnJS(setToast)(null);
          })
        )
      );
    },
    [translateY]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 60,
              left: 16,
              right: 16,
              zIndex: 9999,
              borderRadius: 12,
              padding: 16,
              backgroundColor: TOAST_COLORS[toast.type].bg,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            },
            animatedStyle,
          ]}
        >
          <Pressable onPress={hideToast}>
            <Text
              style={{
                color: TOAST_COLORS[toast.type].text,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
