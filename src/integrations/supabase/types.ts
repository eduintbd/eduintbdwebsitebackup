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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          badge_icon: string | null
          description: string | null
          earned_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          badge_icon?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          badge_icon?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      communication_channels: {
        Row: {
          channel_identifier: string
          channel_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          channel_identifier: string
          channel_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          channel_identifier?: string
          channel_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_channels_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          created_at: string | null
          display_order: number | null
          field_category: string | null
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          is_editable_by_student: boolean | null
          is_required: boolean | null
          is_visible_to_student: boolean | null
          show_in_details: boolean | null
          show_in_table: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          field_category?: string | null
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: string
          is_editable_by_student?: boolean | null
          is_required?: boolean | null
          is_visible_to_student?: boolean | null
          show_in_details?: boolean | null
          show_in_table?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          field_category?: string | null
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_editable_by_student?: boolean | null
          is_required?: boolean | null
          is_visible_to_student?: boolean | null
          show_in_details?: boolean | null
          show_in_table?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ielts_modules: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          difficulty: string
          id: string
          module_type: string
          order_index: number
          title: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty: string
          id?: string
          module_type: string
          order_index: number
          title: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          module_type?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      problem_areas: {
        Row: {
          created_at: string | null
          error_count: number | null
          id: string
          improvement_suggestions: string | null
          last_error_at: string | null
          module_type: string
          skill_area: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_count?: number | null
          id?: string
          improvement_suggestions?: string | null
          last_error_at?: string | null
          module_type: string
          skill_area: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_count?: number | null
          id?: string
          improvement_suggestions?: string | null
          last_error_at?: string | null
          module_type?: string
          skill_area?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          target_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          target_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          target_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          module_id: string | null
          question_id: string | null
          user_answer: string
          user_id: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          module_id?: string | null
          question_id?: string | null
          user_answer: string
          user_id?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          module_id?: string | null
          question_id?: string | null
          user_answer?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "ielts_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          explanation: string | null
          id: string
          module_id: string | null
          options: Json | null
          points: number | null
          question_text: string
          question_type: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id?: string | null
          options?: Json | null
          points?: number | null
          question_text: string
          question_type: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id?: string | null
          options?: Json | null
          points?: number | null
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "ielts_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      student_activities: {
        Row: {
          activity_description: string | null
          activity_metadata: Json | null
          activity_title: string
          activity_type: string
          created_at: string | null
          created_by: string | null
          id: string
          student_id: string
        }
        Insert: {
          activity_description?: string | null
          activity_metadata?: Json | null
          activity_title: string
          activity_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id: string
        }
        Update: {
          activity_description?: string | null
          activity_metadata?: Json | null
          activity_title?: string
          activity_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      student_applications: {
        Row: {
          admin_notes: string | null
          application_status: string | null
          assigned_counselor: string | null
          budget: string | null
          cas_received: boolean | null
          competitor_universities: string | null
          consultation_completed: boolean | null
          course_name: string | null
          created_at: string | null
          deposit_amount: number | null
          deposit_paid: boolean | null
          details: string | null
          document_urls: string[] | null
          documents_uploaded: boolean | null
          email: string
          email_verified: boolean | null
          enrolled_university: string | null
          id: string
          intake_semester: string | null
          level: string | null
          lifecycle_stage: string | null
          meeting_link: string | null
          name: string
          offer_letter_received: boolean | null
          phone: string
          preferred_course: string | null
          preferred_partners: string | null
          priority_level: string | null
          reference_source: string | null
          scholarship_amount: number | null
          session_booked: boolean | null
          session_date: string | null
          session_notes: string | null
          status: string | null
          study_destination: string | null
          study_year: string | null
          tuition_fees: number | null
          updated_at: string | null
          verification_token: string | null
          verified_at: string | null
          visa_application_date: string | null
          visa_approval_date: string | null
          visa_status: string | null
        }
        Insert: {
          admin_notes?: string | null
          application_status?: string | null
          assigned_counselor?: string | null
          budget?: string | null
          cas_received?: boolean | null
          competitor_universities?: string | null
          consultation_completed?: boolean | null
          course_name?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          details?: string | null
          document_urls?: string[] | null
          documents_uploaded?: boolean | null
          email: string
          email_verified?: boolean | null
          enrolled_university?: string | null
          id?: string
          intake_semester?: string | null
          level?: string | null
          lifecycle_stage?: string | null
          meeting_link?: string | null
          name: string
          offer_letter_received?: boolean | null
          phone: string
          preferred_course?: string | null
          preferred_partners?: string | null
          priority_level?: string | null
          reference_source?: string | null
          scholarship_amount?: number | null
          session_booked?: boolean | null
          session_date?: string | null
          session_notes?: string | null
          status?: string | null
          study_destination?: string | null
          study_year?: string | null
          tuition_fees?: number | null
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
          visa_application_date?: string | null
          visa_approval_date?: string | null
          visa_status?: string | null
        }
        Update: {
          admin_notes?: string | null
          application_status?: string | null
          assigned_counselor?: string | null
          budget?: string | null
          cas_received?: boolean | null
          competitor_universities?: string | null
          consultation_completed?: boolean | null
          course_name?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          details?: string | null
          document_urls?: string[] | null
          documents_uploaded?: boolean | null
          email?: string
          email_verified?: boolean | null
          enrolled_university?: string | null
          id?: string
          intake_semester?: string | null
          level?: string | null
          lifecycle_stage?: string | null
          meeting_link?: string | null
          name?: string
          offer_letter_received?: boolean | null
          phone?: string
          preferred_course?: string | null
          preferred_partners?: string | null
          priority_level?: string | null
          reference_source?: string | null
          scholarship_amount?: number | null
          session_booked?: boolean | null
          session_date?: string | null
          session_notes?: string | null
          status?: string | null
          study_destination?: string | null
          study_year?: string | null
          tuition_fees?: number | null
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
          visa_application_date?: string | null
          visa_approval_date?: string | null
          visa_status?: string | null
        }
        Relationships: []
      }
      student_field_values: {
        Row: {
          field_id: string
          field_value: string | null
          id: string
          student_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          field_id: string
          field_value?: string | null
          id?: string
          student_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          field_id?: string
          field_value?: string | null
          id?: string
          student_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_field_values_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      student_links: {
        Row: {
          created_at: string | null
          id: string
          last_accessed_at: string | null
          link_url: string
          student_id: string
          unique_token: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          link_url: string
          student_id: string
          unique_token: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          link_url?: string
          student_id?: string
          unique_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_links_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      student_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          sender_email: string
          sender_type: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          sender_email: string
          sender_type: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          sender_email?: string
          sender_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          module_id: string | null
          score: number | null
          time_spent: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          score?: number | null
          time_spent?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          score?: number | null
          time_spent?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "ielts_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_questions_safe: {
        Row: {
          created_at: string | null
          id: string | null
          module_id: string | null
          options: Json | null
          points: number | null
          question_text: string | null
          question_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          module_id?: string | null
          options?: Json | null
          points?: number | null
          question_text?: string | null
          question_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          module_id?: string | null
          options?: Json | null
          points?: number | null
          question_text?: string | null
          question_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "ielts_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_student_link: { Args: { p_student_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
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
      app_role: ["admin", "student"],
    },
  },
} as const
