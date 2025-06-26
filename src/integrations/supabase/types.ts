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
      applications: {
        Row: {
          application_reason: string
          applied_at: string
          id: string
          post_id: string
          reviewed_at: string | null
          selection_status: string | null
          user_id: string
        }
        Insert: {
          application_reason: string
          applied_at?: string
          id?: string
          post_id: string
          reviewed_at?: string | null
          selection_status?: string | null
          user_id: string
        }
        Update: {
          application_reason?: string
          applied_at?: string
          id?: string
          post_id?: string
          reviewed_at?: string | null
          selection_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "experience_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_solutions: {
        Row: {
          category: string
          created_at: string
          id: string
          keywords: string[]
          priority_score: number
          solution_content: string
          solution_title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          keywords: string[]
          priority_score?: number
          solution_content: string
          solution_title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          keywords?: string[]
          priority_score?: number
          solution_content?: string
          solution_title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      complaints: {
        Row: {
          assigned_to: string | null
          category: string
          complainant_contact: string
          complainant_name: string
          complaint_number: string
          content: string
          created_at: string
          id: string
          priority: string
          resolution_content: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          complainant_contact: string
          complainant_name: string
          complaint_number: string
          content: string
          created_at?: string
          id?: string
          priority?: string
          resolution_content?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          complainant_contact?: string
          complainant_name?: string
          complaint_number?: string
          content?: string
          created_at?: string
          id?: string
          priority?: string
          resolution_content?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          admin_action: string | null
          admin_id: string | null
          content_id: string
          content_type: string
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          admin_action?: string | null
          admin_id?: string | null
          content_id: string
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          admin_action?: string | null
          admin_id?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
      }
      duty_assignments: {
        Row: {
          assignment_date: string
          backup_worker_id: number
          created_at: string
          duty_type: string
          id: string
          primary_worker_id: number
          updated_at: string
        }
        Insert: {
          assignment_date: string
          backup_worker_id: number
          created_at?: string
          duty_type: string
          id?: string
          primary_worker_id: number
          updated_at?: string
        }
        Update: {
          assignment_date?: string
          backup_worker_id?: number
          created_at?: string
          duty_type?: string
          id?: string
          primary_worker_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "duty_assignments_backup_worker_id_fkey"
            columns: ["backup_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_list"
            referencedColumns: ["일련번호"]
          },
          {
            foreignKeyName: "duty_assignments_primary_worker_id_fkey"
            columns: ["primary_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_list"
            referencedColumns: ["일련번호"]
          },
        ]
      }
      duty_reports: {
        Row: {
          assignment_id: string | null
          created_at: string
          duty_worker_id: number | null
          handover_completion_rate: number | null
          handover_issues: string | null
          handover_notes: string | null
          handover_pending: string | null
          id: string
          instruction_abnormalities: string | null
          instruction_content: string | null
          instruction_datetime: string | null
          instruction_handover: string | null
          patrol_actions: string | null
          patrol_content: string | null
          patrol_datetime: string | null
          patrol_notes: string | null
          report_date: string
          report_types: string[] | null
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string
          duty_worker_id?: number | null
          handover_completion_rate?: number | null
          handover_issues?: string | null
          handover_notes?: string | null
          handover_pending?: string | null
          id?: string
          instruction_abnormalities?: string | null
          instruction_content?: string | null
          instruction_datetime?: string | null
          instruction_handover?: string | null
          patrol_actions?: string | null
          patrol_content?: string | null
          patrol_datetime?: string | null
          patrol_notes?: string | null
          report_date: string
          report_types?: string[] | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string
          duty_worker_id?: number | null
          handover_completion_rate?: number | null
          handover_issues?: string | null
          handover_notes?: string | null
          handover_pending?: string | null
          id?: string
          instruction_abnormalities?: string | null
          instruction_content?: string | null
          instruction_datetime?: string | null
          instruction_handover?: string | null
          patrol_actions?: string | null
          patrol_content?: string | null
          patrol_datetime?: string | null
          patrol_notes?: string | null
          report_date?: string
          report_types?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "duty_reports_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "duty_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_reports_duty_worker_id_fkey"
            columns: ["duty_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_list"
            referencedColumns: ["일련번호"]
          },
        ]
      }
      experience_posts: {
        Row: {
          created_at: string
          description: string
          id: string
          max_participants: number | null
          mission_content: string
          recruit_end_date: string
          recruit_start_date: string
          requirements: string
          reward: string | null
          status: string | null
          store_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          max_participants?: number | null
          mission_content: string
          recruit_end_date: string
          recruit_start_date: string
          requirements: string
          reward?: string | null
          status?: string | null
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          max_participants?: number | null
          mission_content?: string
          recruit_end_date?: string
          recruit_start_date?: string
          requirements?: string
          reward?: string | null
          status?: string | null
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_posts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      fire_safety_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          keywords: string[]
          question: string
          regulation_reference: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          keywords?: string[]
          question: string
          regulation_reference?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          keywords?: string[]
          question?: string
          regulation_reference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      law_sobang2: {
        Row: {
          created_at: string
          doc_id: string
          documents: string
          embedding: string | null
          metadatas: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          doc_id: string
          documents: string
          embedding?: string | null
          metadatas?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          doc_id?: string
          documents?: string
          embedding?: string | null
          metadatas?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          order_date: string
          status: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          order_date?: string
          status?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          order_date?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: []
      }
      penalty_duties: {
        Row: {
          created_at: string
          id: string
          penalty_assigned_date: string | null
          penalty_status: string
          reported_by: string
          updated_at: string
          violation_date: string
          violation_details: string
          violation_type: string
          worker_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          penalty_assigned_date?: string | null
          penalty_status?: string
          reported_by: string
          updated_at?: string
          violation_date: string
          violation_details: string
          violation_type: string
          worker_id: number
        }
        Update: {
          created_at?: string
          id?: string
          penalty_assigned_date?: string | null
          penalty_status?: string
          reported_by?: string
          updated_at?: string
          violation_date?: string
          violation_details?: string
          violation_type?: string
          worker_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "penalty_duties_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_list"
            referencedColumns: ["일련번호"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          interest_categories: string[] | null
          nickname: string
          profile_image: string | null
          sns_instagram: string | null
          sns_tiktok: string | null
          sns_youtube: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          interest_categories?: string[] | null
          nickname: string
          profile_image?: string | null
          sns_instagram?: string | null
          sns_tiktok?: string | null
          sns_youtube?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          interest_categories?: string[] | null
          nickname?: string
          profile_image?: string | null
          sns_instagram?: string | null
          sns_tiktok?: string | null
          sns_youtube?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          application_id: string | null
          content: string
          created_at: string
          id: string
          images: string[] | null
          rating: number
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          rating: number
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          rating?: number
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          sale_date: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          sale_date?: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          sale_date?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          category: string
          contact_email: string | null
          contact_phone: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          address: string
          category: string
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          address?: string
          category?: string
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_inquiries: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          matched_faqs: string[] | null
          satisfaction_rating: number | null
          user_question: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          matched_faqs?: string[] | null
          satisfaction_rating?: number | null
          user_question: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          matched_faqs?: string[] | null
          satisfaction_rating?: number | null
          user_question?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      user_sanctions: {
        Row: {
          admin_id: string
          created_at: string
          duration_days: number | null
          expires_at: string | null
          id: string
          is_active: boolean
          reason: string
          type: string
          user_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason: string
          type?: string
          user_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      worker_list: {
        Row: {
          메일주소: string | null
          소속부서: string | null
          이름: string | null
          일련번호: number
          전화번호: string | null
          제외여부: string | null
          직급: string | null
        }
        Insert: {
          메일주소?: string | null
          소속부서?: string | null
          이름?: string | null
          일련번호: number
          전화번호?: string | null
          제외여부?: string | null
          직급?: string | null
        }
        Update: {
          메일주소?: string | null
          소속부서?: string | null
          이름?: string | null
          일련번호?: number
          전화번호?: string | null
          제외여부?: string | null
          직급?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
