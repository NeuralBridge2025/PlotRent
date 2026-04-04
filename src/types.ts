import type {
  PlotRow,
  Booking,
  MessageRow,
  ServiceRow,
  Profile,
  Review,
} from "@/lib/database.types";

// Re-export database row types for convenience
export type { Profile, Booking, Review };

// Enriched plot type with computed fields for UI display
export interface Plot extends PlotRow {
  host_name?: string;
  host_avatar?: string;
  distance_km?: number;
}

// Message with sender profile info
export interface Message extends MessageRow {
  sender_name?: string;
  sender_avatar?: string;
}

// Service with display-friendly fields
export interface Service extends ServiceRow {
  // Additional UI fields can be added here
}

// Conversation preview for chat list
export interface Conversation {
  id: string;
  other_user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
  plot_title: string | null;
}

// Booking with related plot and user info
export interface BookingWithDetails extends Booking {
  plot: PlotRow;
  renter: Profile;
}

// Host dashboard stats
export interface HostStats {
  monthly_earnings: number;
  earnings_trend: number;
  active_plots: number;
  occupancy_rate: number;
}

// Filter options for Explore screen
export interface PlotFilters {
  min_price?: number;
  max_price?: number;
  min_size?: number;
  max_size?: number;
  max_distance_km?: number;
  soil_type?: string;
  sun_exposure?: string;
  tags?: string[];
  instant_book?: boolean;
}
