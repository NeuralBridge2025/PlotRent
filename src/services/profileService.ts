import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/database.types";

type UserRole = "renter" | "host" | "both";

/**
 * Update the user's role on their profile.
 */
export async function updateProfileRole(
  userId: string,
  role: UserRole
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
