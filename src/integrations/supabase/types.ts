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
    Enums: {},
  },
} as const
