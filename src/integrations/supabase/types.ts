export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: string
          station_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          station_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          location_enabled: boolean
          notifications_enabled: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          location_enabled?: boolean
          notifications_enabled?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location_enabled?: boolean
          notifications_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      station_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          review: string | null
          station_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review?: string | null
          station_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review?: string | null
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "station_ratings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      station_reports: {
        Row: {
          created_at: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          is_owner_report: boolean
          reported_availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          reported_price: number | null
          reported_queue: Database["public"]["Enums"]["queue_level"] | null
          station_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_owner_report?: boolean
          reported_availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          reported_price?: number | null
          reported_queue?: Database["public"]["Enums"]["queue_level"] | null
          station_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_owner_report?: boolean
          reported_availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          reported_price?: number | null
          reported_queue?: Database["public"]["Enums"]["queue_level"] | null
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "station_reports_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          address: string
          avg_rating: number
          computed_diesel_avail:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_diesel_price: number | null
          computed_gas_avail:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_gas_price: number | null
          computed_petrol_avail:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_petrol_price: number | null
          computed_queue: Database["public"]["Enums"]["queue_level"] | null
          confidence: Database["public"]["Enums"]["confidence_level"] | null
          created_at: string
          id: string
          last_updated: string
          latitude: number
          longitude: number
          name: string
          open_hours: string
          open_now: boolean
          owner_id: string | null
          rating_count: number
          report_count: number
          verified: boolean
        }
        Insert: {
          address: string
          avg_rating?: number
          computed_diesel_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_diesel_price?: number | null
          computed_gas_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_gas_price?: number | null
          computed_petrol_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_petrol_price?: number | null
          computed_queue?: Database["public"]["Enums"]["queue_level"] | null
          confidence?: Database["public"]["Enums"]["confidence_level"] | null
          created_at?: string
          id?: string
          last_updated?: string
          latitude?: number
          longitude?: number
          name: string
          open_hours?: string
          open_now?: boolean
          owner_id?: string | null
          rating_count?: number
          report_count?: number
          verified?: boolean
        }
        Update: {
          address?: string
          avg_rating?: number
          computed_diesel_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_diesel_price?: number | null
          computed_gas_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_gas_price?: number | null
          computed_petrol_avail?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          computed_petrol_price?: number | null
          computed_queue?: Database["public"]["Enums"]["queue_level"] | null
          confidence?: Database["public"]["Enums"]["confidence_level"] | null
          created_at?: string
          id?: string
          last_updated?: string
          latitude?: number
          longitude?: number
          name?: string
          open_hours?: string
          open_now?: boolean
          owner_id?: string | null
          rating_count?: number
          report_count?: number
          verified?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recalculate_station_truth: {
        Args: { p_station_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "station_owner"
      availability_status: "available" | "limited" | "unavailable"
      confidence_level: "low" | "medium" | "high" | "outdated"
      fuel_type: "petrol" | "diesel" | "gas"
      queue_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "station_owner"],
      availability_status: ["available", "limited", "unavailable"],
      confidence_level: ["low", "medium", "high", "outdated"],
      fuel_type: ["petrol", "diesel", "gas"],
      queue_level: ["low", "medium", "high"],
    },
  },
} as const
