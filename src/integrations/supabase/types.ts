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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_private_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      ai_knowledge: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          position: number
          tags: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          tags?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          tags?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_room_messages: {
        Row: {
          body: string
          created_at: string
          display_name: string
          id: string
          is_staff: boolean
          session_id: string
        }
        Insert: {
          body: string
          created_at?: string
          display_name?: string
          id?: string
          is_staff?: boolean
          session_id: string
        }
        Update: {
          body?: string
          created_at?: string
          display_name?: string
          id?: string
          is_staff?: boolean
          session_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          full_name: string
          id: string
          insurance_type: string | null
          national_id: string | null
          phone: string
          province: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          full_name: string
          id?: string
          insurance_type?: string | null
          national_id?: string | null
          phone: string
          province?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          full_name?: string
          id?: string
          insurance_type?: string | null
          national_id?: string | null
          phone?: string
          province?: string | null
        }
        Relationships: []
      }
      customer_documents: {
        Row: {
          category: string | null
          created_at: string
          file_name: string
          file_path: string
          full_name: string | null
          id: string
          mime_type: string | null
          note: string | null
          phone: string | null
          session_id: string | null
          size_bytes: number | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_name: string
          file_path: string
          full_name?: string | null
          id?: string
          mime_type?: string | null
          note?: string | null
          phone?: string | null
          session_id?: string | null
          size_bytes?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          full_name?: string | null
          id?: string
          mime_type?: string | null
          note?: string | null
          phone?: string | null
          session_id?: string | null
          size_bytes?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      damage_reports: {
        Row: {
          accident_date: string | null
          created_at: string
          description: string | null
          full_name: string
          id: string
          phone: string
          policy_number: string | null
          status: string
        }
        Insert: {
          accident_date?: string | null
          created_at?: string
          description?: string | null
          full_name: string
          id?: string
          phone: string
          policy_number?: string | null
          status?: string
        }
        Update: {
          accident_date?: string | null
          created_at?: string
          description?: string | null
          full_name?: string
          id?: string
          phone?: string
          policy_number?: string | null
          status?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_footer_links: {
        Row: {
          created_at: string
          href: string
          id: string
          label: string
          position: number
          section_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          label: string
          position?: number
          section_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          label?: string
          position?: number
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_footer_links_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "site_footer_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      site_footer_sections: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_menu_items: {
        Row: {
          created_at: string
          device: string
          href: string | null
          id: string
          is_active: boolean
          label: string
          parent_id: string | null
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          device?: string
          href?: string | null
          id?: string
          is_active?: boolean
          label: string
          parent_id?: string | null
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          device?: string
          href?: string | null
          id?: string
          is_active?: boolean
          label?: string
          parent_id?: string | null
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "site_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          custom_icon_url: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          label: string
          platform: string
          position: number
          size_px: number
          updated_at: string
          url: string
          username: string | null
        }
        Insert: {
          created_at?: string
          custom_icon_url?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          label: string
          platform: string
          position?: number
          size_px?: number
          updated_at?: string
          url: string
          username?: string | null
        }
        Update: {
          created_at?: string
          custom_icon_url?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          label?: string
          platform?: string
          position?: number
          size_px?: number
          updated_at?: string
          url?: string
          username?: string | null
        }
        Relationships: []
      }
      telegram_bots: {
        Row: {
          bot_token: string
          bot_username: string | null
          created_at: string
          default_chat_ids: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          bot_token: string
          bot_username?: string | null
          created_at?: string
          default_chat_ids?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          bot_token?: string
          bot_username?: string | null
          created_at?: string
          default_chat_ids?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      telegram_flows: {
        Row: {
          bot_id: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          schedule_cron: string | null
          steps: Json
          trigger_keyword: string | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          schedule_cron?: string | null
          steps?: Json
          trigger_keyword?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          schedule_cron?: string | null
          steps?: Json
          trigger_keyword?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_flows_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "telegram_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_runs: {
        Row: {
          bot_id: string | null
          created_at: string
          details: Json
          flow_id: string | null
          id: string
          message: string | null
          status: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string
          details?: Json
          flow_id?: string | null
          id?: string
          message?: string | null
          status?: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string
          details?: Json
          flow_id?: string | null
          id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_runs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "telegram_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_runs_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "telegram_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_updates: {
        Row: {
          bot_id: string | null
          chat_id: number | null
          created_at: string
          from_user: string | null
          id: string
          payload: Json
          raw: Json
          text: string | null
          update_id: number
        }
        Insert: {
          bot_id?: string | null
          chat_id?: number | null
          created_at?: string
          from_user?: string | null
          id?: string
          payload?: Json
          raw?: Json
          text?: string | null
          update_id: number
        }
        Update: {
          bot_id?: string | null
          chat_id?: number | null
          created_at?: string
          from_user?: string | null
          id?: string
          payload?: Json
          raw?: Json
          text?: string | null
          update_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "telegram_updates_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "telegram_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
