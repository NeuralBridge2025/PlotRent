import { supabase } from "@/lib/supabase";
import type { Service } from "@/types";

/**
 * Fetch active services, optionally filtered by category.
 */
export async function fetchServices(category?: string): Promise<Service[]> {
  let query = supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as Service[];
}
