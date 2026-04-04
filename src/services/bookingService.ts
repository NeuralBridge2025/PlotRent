import { supabase } from "@/lib/supabase";
import type { Database, Booking, PlotRow, Profile } from "@/lib/database.types";
import type { BookingWithDetails } from "@/types";

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

/**
 * Create a new booking.
 */
export async function createBooking(
  booking: BookingInsert
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch bookings for a renter with plot and renter profile details.
 */
export async function fetchRenterBookings(
  renterId: string
): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, plots!bookings_plot_id_fkey(*), profiles!bookings_renter_id_fkey(*)"
    )
    .eq("renter_id", renterId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => {
    const plot = (row as Record<string, unknown>).plots as PlotRow;
    const renter = (row as Record<string, unknown>).profiles as Profile;
    const { plots: _p, profiles: _r, ...bookingFields } = row as Booking & {
      plots: unknown;
      profiles: unknown;
    };

    return {
      ...bookingFields,
      plot,
      renter,
    } as BookingWithDetails;
  });
}

/**
 * Fetch bookings for plots owned by a host.
 */
export async function fetchHostBookings(
  hostId: string
): Promise<BookingWithDetails[]> {
  // First get host's plot IDs
  const { data: plots, error: plotsError } = await supabase
    .from("plots")
    .select("id")
    .eq("host_id", hostId);

  if (plotsError) throw plotsError;

  const plotIds = (plots ?? []).map((p) => p.id);
  if (plotIds.length === 0) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "*, plots!bookings_plot_id_fkey(*), profiles!bookings_renter_id_fkey(*)"
    )
    .in("plot_id", plotIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => {
    const plot = (row as Record<string, unknown>).plots as PlotRow;
    const renter = (row as Record<string, unknown>).profiles as Profile;
    const { plots: _p, profiles: _r, ...bookingFields } = row as Booking & {
      plots: unknown;
      profiles: unknown;
    };

    return {
      ...bookingFields,
      plot,
      renter,
    } as BookingWithDetails;
  });
}

/**
 * Update booking status (confirm, cancel, complete).
 */
export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
