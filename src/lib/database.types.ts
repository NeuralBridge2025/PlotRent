// Auto-generated Supabase types — regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
//
// This starter version defines the core tables for PlotRent MVP.
// Replace with generated types once the Supabase project is live.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "renter" | "host" | "both";
          level: string | null;
          member_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "renter" | "host" | "both";
          level?: string | null;
          member_since?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "renter" | "host" | "both";
          level?: string | null;
          member_since?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plots: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string | null;
          price_per_month: number;
          size_sqm: number;
          latitude: number;
          longitude: number;
          address: string;
          city: string;
          country: string;
          soil_type: string | null;
          sun_exposure: string | null;
          utilities: string[] | null;
          tags: string[] | null;
          images: string[];
          rating: number | null;
          review_count: number;
          is_active: boolean;
          instant_book: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string | null;
          price_per_month: number;
          size_sqm: number;
          latitude: number;
          longitude: number;
          address: string;
          city: string;
          country?: string;
          soil_type?: string | null;
          sun_exposure?: string | null;
          utilities?: string[] | null;
          tags?: string[] | null;
          images: string[];
          rating?: number | null;
          review_count?: number;
          is_active?: boolean;
          instant_book?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string | null;
          price_per_month?: number;
          size_sqm?: number;
          latitude?: number;
          longitude?: number;
          address?: string;
          city?: string;
          country?: string;
          soil_type?: string | null;
          sun_exposure?: string | null;
          utilities?: string[] | null;
          tags?: string[] | null;
          images?: string[];
          rating?: number | null;
          review_count?: number;
          is_active?: boolean;
          instant_book?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plots_host_id_fkey";
            columns: ["host_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          plot_id: string;
          renter_id: string;
          start_date: string;
          end_date: string;
          status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
          monthly_price: number;
          service_fee: number;
          insurance_fee: number | null;
          security_deposit: number;
          total_amount: number;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plot_id: string;
          renter_id: string;
          start_date: string;
          end_date: string;
          status?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
          monthly_price: number;
          service_fee: number;
          insurance_fee?: number | null;
          security_deposit: number;
          total_amount: number;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plot_id?: string;
          renter_id?: string;
          start_date?: string;
          end_date?: string;
          status?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
          monthly_price?: number;
          service_fee?: number;
          insurance_fee?: number | null;
          security_deposit?: number;
          total_amount?: number;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_plot_id_fkey";
            columns: ["plot_id"];
            referencedRelation: "plots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_renter_id_fkey";
            columns: ["renter_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          booking_id: string | null;
          sender_id: string;
          receiver_id: string;
          text: string | null;
          image_url: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          sender_id: string;
          receiver_id: string;
          text?: string | null;
          image_url?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string | null;
          sender_id?: string;
          receiver_id?: string;
          text?: string | null;
          image_url?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          unit: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          unit?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
          unit?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          plot_id: string;
          reviewer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plot_id: string;
          reviewer_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plot_id?: string;
          reviewer_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_plot_id_fkey";
            columns: ["plot_id"];
            referencedRelation: "plots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_conversations: {
        Args: { p_user_id: string };
        Returns: {
          conversation_id: string;
          other_user_id: string;
          other_user_name: string | null;
          other_user_avatar: string | null;
          last_message: string | null;
          last_message_at: string;
          unread_count: number;
        }[];
      };
    };
    Enums: {
      user_role: "renter" | "host" | "both";
      booking_status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type PlotRow = Database["public"]["Tables"]["plots"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
