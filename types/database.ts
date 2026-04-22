export type ExerciseType =
  | "mcq"
  | "numeric"
  | "formula"
  | "text"
  | "code"
  | "circuit"
  | "conversion"
  | "ordering"
  | "match_pairs";

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
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          order_index: number;
        };
        Insert: Database["public"]["Tables"]["subjects"]["Row"];
        Update: Partial<Database["public"]["Tables"]["subjects"]["Row"]>;
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          description: string | null;
          difficulty: number;
          cir_importance: number;
          order_index: number;
        };
        Insert: {
          id: string;
          subject_id: string;
          name: string;
          description?: string | null;
          difficulty?: number;
          cir_importance?: number;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["topics"]["Insert"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          content_md: string;
          estimated_minutes: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          title: string;
          content_md: string;
          estimated_minutes?: number;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          topic_id: string;
          type: ExerciseType;
          difficulty: number;
          question_md: string;
          data: Json;
          explanation_md: string | null;
          colibrimo_connection: string | null;
          created_by: "seed" | "gemini";
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          type: ExerciseType;
          difficulty?: number;
          question_md: string;
          data: Json;
          explanation_md?: string | null;
          colibrimo_connection?: string | null;
          created_by?: "seed" | "gemini";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Insert"]>;
        Relationships: [];
      };
      flashcards: {
        Row: {
          id: string;
          topic_id: string;
          front_md: string;
          back_md: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          topic_id: string;
          front_md: string;
          back_md: string;
          tags?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["flashcards"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          display_name: string | null;
          target_interview_date: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          display_name?: string | null;
          target_interview_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          answer: Json;
          is_correct: boolean;
          score: number;
          time_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          answer: Json;
          is_correct: boolean;
          score?: number;
          time_seconds?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attempts"]["Insert"]>;
        Relationships: [];
      };
      mastery: {
        Row: {
          user_id: string;
          topic_id: string;
          score: number;
          confidence: number;
          last_updated: string;
        };
        Insert: {
          user_id: string;
          topic_id: string;
          score?: number;
          confidence?: number;
          last_updated?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mastery"]["Insert"]>;
        Relationships: [];
      };
      review_states: {
        Row: {
          user_id: string;
          flashcard_id: string;
          repetitions: number;
          easiness: number;
          interval_days: number;
          next_review_at: string;
          last_reviewed_at: string | null;
        };
        Insert: {
          user_id: string;
          flashcard_id: string;
          repetitions?: number;
          easiness?: number;
          interval_days?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["review_states"]["Insert"]>;
        Relationships: [];
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          transcript: Json | null;
          feedback_md: string | null;
          score: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at?: string;
          ended_at?: string | null;
          transcript?: Json | null;
          feedback_md?: string | null;
          score?: number | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["interview_sessions"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      exercise_type: ExerciseType;
    };
    CompositeTypes: Record<string, never>;
  };
}
