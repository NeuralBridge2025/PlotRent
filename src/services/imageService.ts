import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";

const BUCKET = "plot-images";

/**
 * Launch the device image picker and return the selected asset URI.
 */
export async function pickImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access photos was denied");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0].uri;
}

/**
 * Upload an image from a local URI to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadPlotImage(
  userId: string,
  localUri: string
): Promise<string> {
  // Generate unique filename under the user's folder
  const ext = localUri.split(".").pop() ?? "jpg";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  // Read file as blob for upload
  const response = await fetch(localUri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, blob, {
      contentType: `image/${ext === "png" ? "png" : "jpeg"}`,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Delete a plot image from Supabase Storage.
 */
export async function deletePlotImage(publicUrl: string): Promise<void> {
  // Extract the file path from the public URL
  const bucketPath = publicUrl.split(`${BUCKET}/`)[1];
  if (!bucketPath) return;

  const { error } = await supabase.storage.from(BUCKET).remove([bucketPath]);
  if (error) throw error;
}
