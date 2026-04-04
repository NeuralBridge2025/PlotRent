import { supabase } from "@/lib/supabase";
import type { PlotRow } from "@/lib/database.types";
import type { HostStats } from "@/types";

/**
 * Fetch plots owned by a specific host.
 */
export async function fetchHostPlots(hostId: string): Promise<PlotRow[]> {
  const { data, error } = await supabase
    .from("plots")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch dashboard stats for a host.
 * Aggregates earnings, active plots, and occupancy from bookings.
 */
export async function fetchHostStats(hostId: string): Promise<HostStats> {
  // Get host's plots
  const { data: plots, error: plotsError } = await supabase
    .from("plots")
    .select("id, is_active")
    .eq("host_id", hostId);

  if (plotsError) throw plotsError;

  const activePlots = (plots ?? []).filter((p) => p.is_active).length;
  const plotIds = (plots ?? []).map((p) => p.id);

  if (plotIds.length === 0) {
    return {
      monthly_earnings: 0,
      earnings_trend: 0,
      active_plots: 0,
      occupancy_rate: 0,
    };
  }

  // Get current month's bookings for these plots
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("monthly_price, status")
    .in("plot_id", plotIds)
    .in("status", ["confirmed", "active"])
    .lte("start_date", monthEnd)
    .gte("end_date", monthStart);

  if (bookingsError) throw bookingsError;

  const monthlyEarnings = (bookings ?? []).reduce(
    (sum, b) => sum + b.monthly_price,
    0
  );

  const occupiedPlots = new Set(
    (bookings ?? [])
      .filter((b) => b.status === "active")
      .map((_, i) => i)
  ).size;

  const occupancyRate =
    activePlots > 0
      ? Math.round((Math.min(occupiedPlots, activePlots) / activePlots) * 100)
      : 0;

  return {
    monthly_earnings: monthlyEarnings,
    earnings_trend: 0, // TODO: compare with previous month
    active_plots: activePlots,
    occupancy_rate: occupancyRate,
  };
}
