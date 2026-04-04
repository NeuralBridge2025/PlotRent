import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { X } from "lucide-react-native";
import type { PlotFilters } from "@/types";

const SOIL_TYPES = ["Loamy", "Sandy", "Clay", "Silty", "Peaty", "Chalky"];
const SUN_OPTIONS = ["Full Sun", "Partial Shade", "Full Shade"];

interface FilterModalProps {
  visible: boolean;
  filters: PlotFilters;
  onApply: (filters: PlotFilters) => void;
  onClose: () => void;
}

export default function FilterModal({
  visible,
  filters,
  onApply,
  onClose,
}: FilterModalProps) {
  const [draft, setDraft] = useState<PlotFilters>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  const updateDraft = (patch: Partial<PlotFilters>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const handleApply = () => onApply(draft);

  const handleClear = () => {
    const empty: PlotFilters = {};
    setDraft(empty);
    onApply(empty);
  };

  const activeCount = [
    draft.min_price != null,
    draft.max_price != null,
    draft.min_size != null,
    draft.max_size != null,
    draft.soil_type != null,
    draft.sun_exposure != null,
    draft.instant_book === true,
  ].filter(Boolean).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-surface">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-3 border-b border-outline/20">
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
            className="p-2 -ml-2 rounded-full active:bg-surface-container-high"
          >
            <X color="#1c1b18" size={24} />
          </Pressable>
          <Text className="font-manrope text-lg font-bold text-on-surface">
            Filters
          </Text>
          <Pressable onPress={handleClear} accessibilityRole="button" accessibilityLabel="Clear all filters">
            <Text className="font-inter text-sm font-semibold text-secondary">
              Clear all
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Price Range */}
          <View className="py-5 border-b border-outline/10">
            <Text className="font-manrope text-base font-bold text-on-surface mb-3">
              Price Range (€/month)
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-inter text-xs text-on-surface-variant mb-1">
                  Min
                </Text>
                <TextInput
                  className="bg-surface-container-highest rounded-xl px-4 py-3 font-inter text-on-surface"
                  placeholder="0"
                  placeholderTextColor="#7a757f"
                  keyboardType="numeric"
                  value={draft.min_price != null ? String(draft.min_price) : ""}
                  onChangeText={(v) =>
                    updateDraft({ min_price: v ? Number(v) : undefined })
                  }
                  accessibilityLabel="Minimum price"
                />
              </View>
              <View className="flex-1">
                <Text className="font-inter text-xs text-on-surface-variant mb-1">
                  Max
                </Text>
                <TextInput
                  className="bg-surface-container-highest rounded-xl px-4 py-3 font-inter text-on-surface"
                  placeholder="Any"
                  placeholderTextColor="#7a757f"
                  keyboardType="numeric"
                  value={draft.max_price != null ? String(draft.max_price) : ""}
                  onChangeText={(v) =>
                    updateDraft({ max_price: v ? Number(v) : undefined })
                  }
                  accessibilityLabel="Maximum price"
                />
              </View>
            </View>
          </View>

          {/* Plot Size */}
          <View className="py-5 border-b border-outline/10">
            <Text className="font-manrope text-base font-bold text-on-surface mb-3">
              Plot Size (m²)
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-inter text-xs text-on-surface-variant mb-1">
                  Min
                </Text>
                <TextInput
                  className="bg-surface-container-highest rounded-xl px-4 py-3 font-inter text-on-surface"
                  placeholder="0"
                  placeholderTextColor="#7a757f"
                  keyboardType="numeric"
                  value={draft.min_size != null ? String(draft.min_size) : ""}
                  onChangeText={(v) =>
                    updateDraft({ min_size: v ? Number(v) : undefined })
                  }
                  accessibilityLabel="Minimum plot size"
                />
              </View>
              <View className="flex-1">
                <Text className="font-inter text-xs text-on-surface-variant mb-1">
                  Max
                </Text>
                <TextInput
                  className="bg-surface-container-highest rounded-xl px-4 py-3 font-inter text-on-surface"
                  placeholder="Any"
                  placeholderTextColor="#7a757f"
                  keyboardType="numeric"
                  value={draft.max_size != null ? String(draft.max_size) : ""}
                  onChangeText={(v) =>
                    updateDraft({ max_size: v ? Number(v) : undefined })
                  }
                  accessibilityLabel="Maximum plot size"
                />
              </View>
            </View>
          </View>

          {/* Soil Type */}
          <View className="py-5 border-b border-outline/10">
            <Text className="font-manrope text-base font-bold text-on-surface mb-3">
              Soil Type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SOIL_TYPES.map((soil) => (
                <Pressable
                  key={soil}
                  onPress={() =>
                    updateDraft({
                      soil_type: draft.soil_type === soil ? undefined : soil,
                    })
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: draft.soil_type === soil }}
                  className={`px-4 py-2 rounded-full ${
                    draft.soil_type === soil
                      ? "bg-primary"
                      : "bg-surface-container-highest"
                  }`}
                >
                  <Text
                    className={`font-inter text-sm font-medium ${
                      draft.soil_type === soil ? "text-white" : "text-on-surface"
                    }`}
                  >
                    {soil}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sun Exposure */}
          <View className="py-5 border-b border-outline/10">
            <Text className="font-manrope text-base font-bold text-on-surface mb-3">
              Sun Exposure
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SUN_OPTIONS.map((sun) => (
                <Pressable
                  key={sun}
                  onPress={() =>
                    updateDraft({
                      sun_exposure:
                        draft.sun_exposure === sun ? undefined : sun,
                    })
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: draft.sun_exposure === sun }}
                  className={`px-4 py-2 rounded-full ${
                    draft.sun_exposure === sun
                      ? "bg-primary"
                      : "bg-surface-container-highest"
                  }`}
                >
                  <Text
                    className={`font-inter text-sm font-medium ${
                      draft.sun_exposure === sun
                        ? "text-white"
                        : "text-on-surface"
                    }`}
                  >
                    {sun}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Instant Book */}
          <View className="py-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="font-manrope text-base font-bold text-on-surface">
                  Instant Book
                </Text>
                <Text className="font-inter text-sm text-on-surface-variant mt-1">
                  Only show plots you can book immediately
                </Text>
              </View>
              <Switch
                value={draft.instant_book ?? false}
                onValueChange={(v) =>
                  updateDraft({ instant_book: v || undefined })
                }
                trackColor={{ false: "#7a757f", true: "#4a7c44" }}
                thumbColor={draft.instant_book ? "#32632e" : "#f4f3f4"}
                accessibilityLabel="Instant book filter"
              />
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-6 pt-3 pb-8 border-t border-outline/20">
          <Pressable
            onPress={handleApply}
            accessibilityRole="button"
            accessibilityLabel={`Show results with ${activeCount} filters`}
            className="bg-primary py-4 rounded-2xl items-center active:opacity-90"
          >
            <Text className="text-white font-manrope font-bold text-base">
              {activeCount > 0
                ? `Apply Filters (${activeCount})`
                : "Show All Results"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
