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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      consultations: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          prescription: Json | null
          room_id: string | null
          scheduled_at: string
          status: string
          symptoms: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          prescription?: Json | null
          room_id?: string | null
          scheduled_at: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          prescription?: Json | null
          room_id?: string | null
          scheduled_at?: string
          status?: string
          symptoms?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          availability: Json | null
          consultation_fee: number | null
          created_at: string
          id: string
          is_online: boolean | null
          rating: number | null
          specialties: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: Json | null
          consultation_fee?: number | null
          created_at?: string
          id?: string
          is_online?: boolean | null
          rating?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: Json | null
          consultation_fee?: number | null
          created_at?: string
          id?: string
          is_online?: boolean | null
          rating?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          consultation_id: string | null
          created_at: string
          created_by: string | null
          data: Json | null
          files: Json | null
          id: string
          patient_id: string
          summary: string | null
          title: string
          type: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          files?: Json | null
          id?: string
          patient_id: string
          summary?: string | null
          title: string
          type: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          files?: Json | null
          id?: string
          patient_id?: string
          summary?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          generic_name: string | null
          id: string
          manufacturer: string | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          generic_name?: string | null
          id?: string
          manufacturer?: string | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          generic_name?: string | null
          id?: string
          manufacturer?: string | null
          name?: string
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean | null
          location: unknown | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string | null
          village: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: unknown | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          village: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: unknown | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          village?: string
        }
        Relationships: []
      }
      pharmacy_inventory: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          low_stock_threshold: number | null
          medicine_id: string
          pharmacy_id: string
          price: number | null
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          low_stock_threshold?: number | null
          medicine_id: string
          pharmacy_id: string
          price?: number | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          low_stock_threshold?: number | null
          medicine_id?: string
          pharmacy_id?: string
          price?: number | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_inventory_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_inventory_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          phone?: string | null
          role: string
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
