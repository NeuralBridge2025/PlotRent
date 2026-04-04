import { useState, useEffect, useCallback } from "react";
import type { BookingWithDetails } from "@/types";
import {
  fetchRenterBookings,
  fetchHostBookings,
} from "@/services/bookingService";

interface UseBookingsResult {
  bookings: BookingWithDetails[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Fetch bookings for the current user as a renter.
 */
export function useRenterBookings(
  renterId: string | undefined
): UseBookingsResult {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!renterId) {
      setIsLoading(false);
      setError("Not signed in");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRenterBookings(renterId);
      setBookings(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load bookings";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [renterId]);

  useEffect(() => {
    load();
  }, [load]);

  return { bookings, isLoading, error, refresh: load };
}

/**
 * Fetch bookings for plots owned by the current user (host view).
 */
export function useHostBookings(
  hostId: string | undefined
): UseBookingsResult {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!hostId) {
      setIsLoading(false);
      setError("Not signed in");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHostBookings(hostId);
      setBookings(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load bookings";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    load();
  }, [load]);

  return { bookings, isLoading, error, refresh: load };
}
