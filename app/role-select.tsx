import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Sprout,
  Mountain,
  Handshake,
  Check,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { updateProfileRole } from "@/services/profileService";

type UserRole = "renter" | "host" | "both";

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
  activeClass: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "renter",
    title: "I want to grow",
    description: "Find and rent garden plots near you to grow your own food.",
    icon: <Sprout color="#32632e" size={32} />,
    color: "#32632e",
    bgClass: "bg-primary/10",
    activeClass: "border-primary bg-primary/5",
  },
  {
    role: "host",
    title: "I have land to share",
    description:
      "List your unused land and earn income from urban gardeners.",
    icon: <Mountain color="#a03f29" size={32} />,
    color: "#a03f29",
    bgClass: "bg-secondary/10",
    activeClass: "border-secondary bg-secondary/5",
  },
  {
    role: "both",
    title: "I do both",
    description:
      "Rent plots to grow and share your own land with the community.",
    icon: <Handshake color="#32632e" size={32} />,
    color: "#32632e",
    bgClass: "bg-primary/10",
    activeClass: "border-primary bg-primary/5",
  },
];

export default function RoleSelectScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<UserRole>(
    profile?.role ?? "renter"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateProfileRole(user.id, selected);
      await refreshProfile();
      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update role";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, selected, refreshProfile, showToast]);

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
          Choose Your Role
        </Text>
      </View>

      <View className="flex-1 px-6 pt-4">
        {/* Subtitle */}
        <Text className="font-inter text-base text-on-surface-variant mb-8">
          How would you like to use PlotRent? You can always change this later.
        </Text>

        {/* Role Cards */}
        <View className="gap-4">
          {ROLE_OPTIONS.map((option) => {
            const isActive = selected === option.role;
            return (
              <Pressable
                key={option.role}
                onPress={() => setSelected(option.role)}
                testID={`role-option-${option.role}`}
                className={`rounded-2xl border-2 p-5 flex-row items-center gap-4 ${
                  isActive
                    ? option.activeClass
                    : "border-outline-variant/20 bg-surface-container-lowest"
                }`}
              >
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${option.bgClass}`}
                >
                  {option.icon}
                </View>
                <View className="flex-1">
                  <Text className="font-manrope font-bold text-lg text-on-surface">
                    {option.title}
                  </Text>
                  <Text className="font-inter text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    {option.description}
                  </Text>
                </View>
                {isActive && (
                  <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                    <Check color="#ffffff" size={16} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom CTA */}
      <View
        className="px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleConfirm}
          testID="role-select-continue"
          disabled={isSubmitting}
          className={`py-5 rounded-full flex-row items-center justify-center gap-2 ${
            isSubmitting ? "bg-outline/30" : "bg-primary active:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-manrope font-extrabold text-lg text-white">
              Continue
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
