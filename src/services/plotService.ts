import { supabase } from "@/lib/supabase";
import type { PlotRow, Database } from "@/lib/database.types";
import type { Plot, PlotFilters } from "@/types";

type PlotInsert = Database["public"]["Tables"]["plots"]["Insert"];

/**
 * Fetch active plots, optionally filtered.
 * Joins host profile for display name/avatar.
 */
export async function fetchPlots(filters?: PlotFilters): Promise<Plot[]> {
  let query = supabase
    .from("plots")
    .select("*, profiles!plots_host_id_fkey(full_name, avatar_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.min_price != null) {
    query = query.gte("price_per_month", filters.min_price);
  }
  if (filters?.max_price != null) {
    query = query.lte("price_per_month", filters.max_price);
  }
  if (filters?.min_size != null) {
    query = query.gte("size_sqm", filters.min_size);
  }
  if (filters?.max_size != null) {
    query = query.lte("size_sqm", filters.max_size);
  }
  if (filters?.soil_type) {
    query = query.eq("soil_type", filters.soil_type);
  }
  if (filters?.sun_exposure) {
    query = query.eq("sun_exposure", filters.sun_exposure);
  }
  if (filters?.instant_book) {
    query = query.eq("instant_book", true);
  }
  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps("tags", filters.tags);
  }

  const { data, error } = await query;

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => {
    const profile = (row as Record<string, unknown>).profiles as {
      full_name: string | null;
      avatar_url: string | null;
    } | null;

    const { profiles: _, ...plotFields } = row as PlotRow & {
      profiles: unknown;
    };

    return {
      ...plotFields,
      host_name: profile?.full_name ?? undefined,
      host_avatar: profile?.avatar_url ?? undefined,
    } as Plot;
  });
}

/**
 * Create a new plot listing.
 */
export async function createPlot(plot: PlotInsert): Promise<PlotRow> {
  const { data, error } = await supabase
    .from("plots")
    .insert(plot)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch a single plot by ID.
 */
export async function fetchPlotById(id: string): Promise<Plot | null> {
  const { data, error } = await supabase
    .from("plots")
    .select("*, profiles!plots_host_id_fkey(full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }

  const profile = (data as Record<string, unknown>).profiles as {
    full_name: string | null;
    avatar_url: string | null;
  } | null;

  const { profiles: _, ...plotFields } = data as PlotRow & {
    profiles: unknown;
  };

  return {
    ...plotFields,
    host_name: profile?.full_name ?? undefined,
    host_avatar: profile?.avatar_url ?? undefined,
  } as Plot;
}
