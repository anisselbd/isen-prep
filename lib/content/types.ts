import type { ExerciseType, Json } from "@/types/database";

export type SeedLesson = {
  title: string;
  content_md: string;
  estimated_minutes: number;
};

export type SeedExercise = {
  type: ExerciseType;
  difficulty: number;
  question_md: string;
  data: Json;
  explanation_md: string;
  colibrimo_connection?: string | null;
};

export type SeedFlashcard = {
  front_md: string;
  back_md: string;
  tags?: string[];
};

export type TopicContent = {
  topic_id: string;
  lessons: SeedLesson[];
  exercises: SeedExercise[];
  flashcards: SeedFlashcard[];
};
