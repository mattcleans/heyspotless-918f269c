export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          is_primary: boolean | null
          postal_code: string
          state: string
          street: string
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          postal_code: string
          state: string
          street: string
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          postal_code?: string
          state?: string
          street?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string
          cleaner_id: string | null
          created_at: string
          date: string
          duration: number | null
          guest_email: string | null
          guest_phone: string | null
          id: string
          notes: string | null
          price: number | null
          status: string
          time: string
          user_id: string | null
        }
        Insert: {
          address: string
          cleaner_id?: string | null
          created_at?: string
          date: string
          duration?: number | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          status?: string
          time: string
          user_id?: string | null
        }
        Update: {
          address?: string
          cleaner_id?: string | null
          created_at?: string
          date?: string
          duration?: number | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          status?: string
          time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_profiles: {
        Row: {
          availability: Json | null
          background_check_acknowledgment: boolean | null
          bio: string | null
          contractor_acknowledgment: boolean | null
          created_at: string
          emergency_contact_email: string | null
          emergency_contact_name: string
          emergency_contact_phone: string
          hourly_rate: number
          id: string
          ssn: string
          status: string | null
          work_eligibility_acknowledgment: boolean | null
          years_experience: number | null
        }
        Insert: {
          availability?: Json | null
          background_check_acknowledgment?: boolean | null
          bio?: string | null
          contractor_acknowledgment?: boolean | null
          created_at?: string
          emergency_contact_email?: string | null
          emergency_contact_name: string
          emergency_contact_phone: string
          hourly_rate: number
          id: string
          ssn: string
          status?: string | null
          work_eligibility_acknowledgment?: boolean | null
          years_experience?: number | null
        }
        Update: {
          availability?: Json | null
          background_check_acknowledgment?: boolean | null
          bio?: string | null
          contractor_acknowledgment?: boolean | null
          created_at?: string
          emergency_contact_email?: string | null
          emergency_contact_name?: string
          emergency_contact_phone?: string
          hourly_rate?: number
          id?: string
          ssn?: string
          status?: string | null
          work_eligibility_acknowledgment?: boolean | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cleaner_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaner_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_cleaner_matches: {
        Row: {
          cleaner_id: string | null
          client_id: string | null
          id: string
          matched_at: string
          status: string | null
        }
        Insert: {
          cleaner_id?: string | null
          client_id?: string | null
          id?: string
          matched_at?: string
          status?: string | null
        }
        Update: {
          cleaner_id?: string | null
          client_id?: string | null
          id?: string
          matched_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_cleaner_matches_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_cleaner_matches_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_cleaner_matches_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          booking_id: string | null
          cleaner_id: string | null
          created_at: string
          id: string
          paid_at: string | null
          status: string | null
          tip_amount: number | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          cleaner_id?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string | null
          tip_amount?: number | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          cleaner_id?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string | null
          tip_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "all_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["message_status"] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_type: string
          created_at: string
          expiry_month: number
          expiry_year: number
          id: string
          is_default: boolean | null
          last_four: string
          user_id: string | null
        }
        Insert: {
          card_type: string
          created_at?: string
          expiry_month: number
          expiry_year: number
          id?: string
          is_default?: boolean | null
          last_four: string
          user_id?: string | null
        }
        Update: {
          card_type?: string
          created_at?: string
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_default?: boolean | null
          last_four?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          user_type: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          user_type: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          user_type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "all_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "cleaner_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          name: string
          value: string
        }
        Insert: {
          name: string
          value: string
        }
        Update: {
          name?: string
          value?: string
        }
        Relationships: []
      }
      service_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          price_multiplier: number
          type: Database["public"]["Enums"]["cleaning_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price_multiplier: number
          type: Database["public"]["Enums"]["cleaning_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price_multiplier?: number
          type?: Database["public"]["Enums"]["cleaning_type"]
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          admin_id: string | null
          content: string
          created_at: string
          guest_email: string | null
          guest_ip: string | null
          id: string
          sender_type: Database["public"]["Enums"]["sender_type"]
          status: Database["public"]["Enums"]["message_status"]
        }
        Insert: {
          admin_id?: string | null
          content: string
          created_at?: string
          guest_email?: string | null
          guest_ip?: string | null
          id?: string
          sender_type: Database["public"]["Enums"]["sender_type"]
          status?: Database["public"]["Enums"]["message_status"]
        }
        Update: {
          admin_id?: string | null
          content?: string
          created_at?: string
          guest_email?: string | null
          guest_ip?: string | null
          id?: string
          sender_type?: Database["public"]["Enums"]["sender_type"]
          status?: Database["public"]["Enums"]["message_status"]
        }
        Relationships: []
      }
    }
    Views: {
      all_bookings: {
        Row: {
          address: string | null
          cleaner_id: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          date: string | null
          duration: number | null
          guest_email: string | null
          guest_phone: string | null
          id: string | null
          notes: string | null
          price: number | null
          status: string | null
          time: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_info: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          hourly_rate: number | null
          id: string | null
          last_name: string | null
          phone: string | null
          status: string | null
          user_type: string | null
          years_experience: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_secret: {
        Args: { secret_name: string }
        Returns: string
      }
    }
    Enums: {
      cleaning_type: "standard" | "deep" | "move"
      message_permission: "admin" | "client" | "cleaner" | "support"
      message_status: "unread" | "read" | "answered"
      sender_type: "guest" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cleaning_type: ["standard", "deep", "move"],
      message_permission: ["admin", "client", "cleaner", "support"],
      message_status: ["unread", "read", "answered"],
      sender_type: ["guest", "admin"],
    },
  },
} as const
