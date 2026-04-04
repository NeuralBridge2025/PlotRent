import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Check,
  X,
  Plus,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { createPlot } from "@/services/plotService";
import { pickImage, uploadPlotImage } from "@/services/imageService";

const SOIL_TYPES = ["Loamy", "Clay", "Sandy", "Silty", "Peaty", "Chalky"];
const SUN_OPTIONS = ["Full Sun", "Partial Shade", "Full Shade"];
const UTILITY_OPTIONS = ["Water Access", "Toolshed", "Compost", "Electricity", "Fencing"];

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

function FormField({ label, children, required }: FormFieldProps) {
  return (
    <View className="mb-5">
      <Text className="font-inter font-semibold text-sm text-on-surface mb-2">
        {label}
        {required && <Text className="text-secondary"> *</Text>}
      </Text>
      {children}
    </View>
  );
}

interface ChipSelectProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

function ChipSelect({ options, selected, onSelect }: ChipSelectProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(selected === option ? null : option)}
          className={`px-4 py-2.5 rounded-full ${
            selected === option
              ? "bg-primary"
              : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-sm font-medium font-inter ${
              selected === option ? "text-white" : "text-on-surface"
            }`}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

interface MultiChipSelectProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function MultiChipSelect({ options, selected, onToggle }: MultiChipSelectProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => onToggle(option)}
            className={`px-4 py-2.5 rounded-full flex-row items-center gap-1.5 ${
              isSelected
                ? "bg-primary"
                : "bg-surface-container-highest"
            }`}
          >
            {isSelected && <Check color="#ffffff" size={14} />}
            <Text
              className={`text-sm font-medium font-inter ${
                isSelected ? "text-white" : "text-on-surface"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CreatePlotScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceText, setPriceText] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [soilType, setSoilType] = useState<string | null>(null);
  const [sunExposure, setSunExposure] = useState<string | null>(null);
  const [utilities, setUtilities] = useState<string[]>([]);
  const [instantBook, setInstantBook] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = useCallback(async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        setImageUris((prev) => [...prev, uri]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to pick image";
      Alert.alert("Error", message);
    }
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleUtility = useCallback((utility: string) => {
    setUtilities((prev) =>
      prev.includes(utility)
        ? prev.filter((u) => u !== utility)
        : [...prev, utility]
    );
  }, []);

  const isValid =
    title.trim().length > 0 &&
    priceText.trim().length > 0 &&
    sizeText.trim().length > 0 &&
    address.trim().length > 0 &&
    city.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!user || !isValid) return;

    const price = parseFloat(priceText);
    const size = parseFloat(sizeText);

    if (isNaN(price) || price <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid monthly price.");
      return;
    }
    if (isNaN(size) || size <= 0) {
      Alert.alert("Invalid Size", "Please enter a valid plot size.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images to Supabase Storage
      const uploadedUrls: string[] = [];
      for (const uri of imageUris) {
        const url = await uploadPlotImage(user.id, uri);
        uploadedUrls.push(url);
      }

      await createPlot({
        host_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        price_per_month: price,
        size_sqm: size,
        latitude: 38.7223, // Default Lisbon — user can update later
        longitude: -9.1393,
        address: address.trim(),
        city: city.trim(),
        country: "Portugal",
        soil_type: soilType,
        sun_exposure: sunExposure,
        utilities: utilities.length > 0 ? utilities : null,
        images: uploadedUrls,
        instant_book: instantBook,
      });

      Alert.alert("Plot Listed!", "Your plot is now live on PlotRent.", [
        { text: "View Dashboard", onPress: () => router.replace("/(tabs)/host") },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create plot";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    user,
    isValid,
    title,
    description,
    priceText,
    sizeText,
    address,
    city,
    soilType,
    sunExposure,
    utilities,
    instantBook,
    imageUris,
  ]);

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="bg-surface/95 border-b border-outline-variant/10 px-4 pb-3 flex-row items-center gap-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="p-2 rounded-full active:bg-surface-container-high"
        >
          <ArrowLeft color="#32632e" size={22} />
        </Pressable>
        <Text className="font-manrope text-xl font-bold text-on-surface">
          List Your Plot
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Upload */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {imageUris.map((uri, index) => (
              <View key={uri} className="w-32 h-32 rounded-2xl overflow-hidden">
                <Image
                  source={{ uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 items-center justify-center"
                >
                  <X color="#ffffff" size={14} />
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={handleAddImage}
              className="w-32 h-32 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/40 items-center justify-center active:bg-surface-container"
            >
              {imageUris.length === 0 ? (
                <>
                  <Camera color="#7a757f" size={28} />
                  <Text className="font-inter text-xs text-on-surface-variant mt-1.5">
                    Add Photos
                  </Text>
                </>
              ) : (
                <>
                  <Plus color="#7a757f" size={24} />
                  <Text className="font-inter text-[10px] text-on-surface-variant mt-1">
                    More
                  </Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>

        {/* Basic Info */}
        <Text className="font-manrope font-bold text-lg text-on-surface mb-4">
          Basic Information
        </Text>

        <FormField label="Plot Title" required>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. The Sunny Terrace Plot"
            placeholderTextColor="#7a757f"
            className="bg-surface-container-low rounded-xl py-3.5 px-4 text-sm font-inter text-on-surface"
          />
        </FormField>

        <FormField label="Description">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell renters what makes your plot special..."
            placeholderTextColor="#7a757f"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-surface-container-low rounded-xl py-3.5 px-4 text-sm font-inter text-on-surface min-h-[100px]"
          />
        </FormField>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormField label="Price (€/month)" required>
              <TextInput
                value={priceText}
                onChangeText={setPriceText}
                placeholder="45"
                placeholderTextColor="#7a757f"
                keyboardType="decimal-pad"
                className="bg-surface-container-low rounded-xl py-3.5 px-4 text-sm font-inter text-on-surface"
              />
            </FormField>
          </View>
          <View className="flex-1">
            <FormField label="Size (m²)" required>
              <TextInput
                value={sizeText}
                onChangeText={setSizeText}
                placeholder="25"
                placeholderTextColor="#7a757f"
                keyboardType="decimal-pad"
                className="bg-surface-container-low rounded-xl py-3.5 px-4 text-sm font-inter text-on-surface"
              />
            </FormField>
          </View>
        </View>

        {/* Location */}
        <Text className="font-manrope font-bold text-lg text-on-surface mb-4 mt-2">
          Location
        </Text>

        <FormField label="Address" required>
          <View className="flex-row items-center bg-surface-container-low rounded-xl">
            <View className="pl-4">
              <MapPin color="#7a757f" size={18} />
            </View>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street address"
              placeholderTextColor="#7a757f"
              className="flex-1 py-3.5 px-3 text-sm font-inter text-on-surface"
            />
          </View>
        </FormField>

        <FormField label="City" required>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Lisbon"
            placeholderTextColor="#7a757f"
            className="bg-surface-container-low rounded-xl py-3.5 px-4 text-sm font-inter text-on-surface"
          />
        </FormField>

        {/* Plot Details */}
        <Text className="font-manrope font-bold text-lg text-on-surface mb-4 mt-2">
          Plot Details
        </Text>

        <FormField label="Soil Type">
          <ChipSelect
            options={SOIL_TYPES}
            selected={soilType}
            onSelect={setSoilType}
          />
        </FormField>

        <FormField label="Sun Exposure">
          <ChipSelect
            options={SUN_OPTIONS}
            selected={sunExposure}
            onSelect={setSunExposure}
          />
        </FormField>

        <FormField label="Utilities">
          <MultiChipSelect
            options={UTILITY_OPTIONS}
            selected={utilities}
            onToggle={toggleUtility}
          />
        </FormField>

        {/* Settings */}
        <Text className="font-manrope font-bold text-lg text-on-surface mb-4 mt-2">
          Settings
        </Text>

        <View className="bg-surface-container-low rounded-xl p-4 flex-row justify-between items-center mb-8">
          <View className="flex-1 mr-4">
            <Text className="font-inter font-bold text-on-surface">
              Instant Book
            </Text>
            <Text className="font-inter text-xs text-on-surface-variant mt-0.5">
              Allow renters to book without prior approval
            </Text>
          </View>
          <Switch
            value={instantBook}
            onValueChange={setInstantBook}
            trackColor={{ false: "#cac4cf", true: "#32632e" }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`py-5 rounded-full flex-row items-center justify-center gap-2 mb-4 ${
            isValid && !isSubmitting
              ? "bg-primary active:opacity-90"
              : "bg-outline/30"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Check color="#ffffff" size={20} />
              <Text className="font-manrope font-extrabold text-lg text-white">
                Publish Plot
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
