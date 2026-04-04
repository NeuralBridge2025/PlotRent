import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  User,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Leaf,
  RefreshCw,
} from "lucide-react-native";
import { usePlot } from "@/hooks/usePlot";

const SERVICE_FEE_RATE = 0.08;
const INSURANCE_FEE = 5.0;
const SECURITY_DEPOSIT = 50.0;

function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export default function BookingReviewScreen() {
  const { plotId } = useLocalSearchParams<{ plotId: string }>();
  const insets = useSafeAreaInsets();
  const { plot, isLoading, error, refresh } = usePlot(plotId);
  const [insurance, setInsurance] = useState(true);

  const pricing = useMemo(() => {
    if (!plot) return null;
    const monthly = plot.price_per_month;
    const serviceFee = Math.round(monthly * SERVICE_FEE_RATE * 100) / 100;
    const insuranceFee = insurance ? INSURANCE_FEE : 0;
    const total = monthly + serviceFee + insuranceFee + SECURITY_DEPOSIT;
    return { monthly, serviceFee, insuranceFee, securityDeposit: SECURITY_DEPOSIT, total };
  }, [plot, insurance]);

  // Loading
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#32632e" />
        <Text className="font-inter text-sm text-on-surface-variant mt-4">
          Loading booking details...
        </Text>
      </View>
    );
  }

  // Error
  if (error || !plot || !pricing) {
    return (
      <View className="flex-1 bg-surface items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
          <RefreshCw color="#a03f29" size={32} />
        </View>
        <Text className="font-manrope text-lg font-bold text-on-surface mb-2 text-center">
          {error ?? "Could not load booking details"}
        </Text>
        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={() => router.back()}
            className="bg-surface-container-highest px-6 py-3 rounded-full active:opacity-80"
          >
            <Text className="text-on-surface font-inter font-semibold">
              Go Back
            </Text>
          </Pressable>
          <Pressable
            onPress={refresh}
            className="bg-primary px-6 py-3 rounded-full active:opacity-90"
          >
            <Text className="text-white font-inter font-semibold">
              Try Again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const firstImage = plot.images?.[0];

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="bg-surface/90 px-4 pb-3 flex-row items-center gap-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="p-2 rounded-full active:bg-surface-container-high"
        >
          <ArrowLeft color="#32632e" size={24} />
        </Pressable>
        <Text className="font-manrope text-2xl font-black text-primary tracking-tighter">
          PlotRent
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Page Title */}
        <View className="mt-4 mb-6">
          <Text className="font-manrope font-extrabold text-3xl text-on-surface tracking-tight leading-tight">
            Review your rental
          </Text>
          <Text className="font-inter text-base text-on-surface-variant mt-1">
            Please verify the details before completing your booking.
          </Text>
        </View>

        {/* Summary Card */}
        <View className="bg-surface-container-low rounded-3xl p-4 overflow-hidden mb-6">
          <View className="flex-row gap-4">
            <View className="w-28 h-28 rounded-2xl overflow-hidden bg-surface-container-high">
              {firstImage ? (
                <Image
                  source={{ uri: firstImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Leaf color="#7a757f" size={24} />
                </View>
              )}
            </View>
            <View className="flex-1 justify-center gap-1.5">
              <View className="flex-row items-center gap-1.5 bg-surface-container-highest self-start px-2.5 py-1 rounded-full">
                <Leaf color="#a03f29" size={12} fill="#a03f29" />
                <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider font-inter">
                  Active Season
                </Text>
              </View>
              <Text
                className="font-manrope font-bold text-xl text-on-surface"
                numberOfLines={2}
              >
                {plot.title}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <User color="#49454f" size={14} />
                <Text className="font-inter text-sm text-on-surface-variant font-medium">
                  Hosted by {plot.host_name ?? "Host"}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar color="#32632e" size={14} />
                <Text className="font-inter text-sm text-primary font-semibold">
                  Monthly rental
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="mb-6">
          <Text className="font-manrope font-bold text-lg mb-3 px-1">
            Price Breakdown
          </Text>
          <View className="bg-surface-container rounded-3xl p-6 gap-4">
            {/* Monthly Rental */}
            <View className="flex-row justify-between items-center">
              <Text className="font-inter text-on-surface-variant font-medium">
                Monthly Rental
              </Text>
              <Text className="font-inter font-bold text-on-surface">
                {formatCurrency(pricing.monthly)}
              </Text>
            </View>

            {/* Service Fee */}
            <View className="flex-row justify-between items-center">
              <Text className="font-inter text-on-surface-variant font-medium">
                Platform Service Fee
              </Text>
              <Text className="font-inter font-bold text-on-surface">
                {formatCurrency(pricing.serviceFee)}
              </Text>
            </View>

            {/* Insurance Toggle */}
            <View className="bg-surface-container-lowest p-4 rounded-2xl flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <Text className="font-inter font-bold text-on-surface">
                  Insurance Add-on
                </Text>
                <Text className="font-inter text-xs text-on-surface-variant">
                  Covers crop damage & theft
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="font-inter font-bold text-on-surface">
                  {formatCurrency(pricing.insuranceFee)}
                </Text>
                <Switch
                  value={insurance}
                  onValueChange={setInsurance}
                  trackColor={{ false: "#cac4cf", true: "#32632e" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            {/* Security Deposit */}
            <View className="flex-row justify-between items-center pt-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-inter text-on-surface-variant font-medium">
                  Security Deposit
                </Text>
                <HelpCircle color="#7a757f" size={14} />
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="font-inter font-bold text-on-surface">
                  {formatCurrency(pricing.securityDeposit)}
                </Text>
                <Text className="font-inter text-[10px] text-on-surface-variant uppercase tracking-wider">
                  (Refundable)
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-outline-variant/20" />

            {/* Total */}
            <View className="flex-row justify-between items-center">
              <Text className="font-manrope font-extrabold text-xl text-on-surface">
                Total
              </Text>
              <Text className="font-manrope font-extrabold text-2xl text-primary">
                {formatCurrency(pricing.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Trust Block */}
        <View className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 flex-row gap-4 items-start mb-8">
          <View className="bg-primary/10 p-2 rounded-xl">
            <ShieldCheck color="#32632e" size={24} />
          </View>
          <View className="flex-1">
            <Text className="font-inter font-bold text-sm text-on-surface leading-tight">
              Protected by PlotRent Guarantee
            </Text>
            <Text className="font-inter text-sm text-on-surface-variant leading-snug mt-1">
              Free cancellation within 48 hours of booking. Reliable support for
              your growing season.
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable
          onPress={() => {
            // TODO: integrate with Stripe via booking service
            router.push("/(tabs)/profile");
          }}
          className="bg-primary py-5 rounded-full shadow-lg flex-row items-center justify-center gap-3 active:opacity-90 mb-4"
        >
          <Text className="font-manrope font-extrabold text-lg text-white">
            Confirm & Pay
          </Text>
          <ArrowRight color="#ffffff" size={22} />
        </Pressable>
      </ScrollView>
    </View>
  );
}
