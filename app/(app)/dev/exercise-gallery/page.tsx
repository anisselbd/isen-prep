// TODO: à supprimer en Phase 7 avec le seed des vrais exercices.
// Cette route permet de valider visuellement les 9 types d'exercice et leur grading.

import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Exercise Gallery · ISEN PREP (dev)",
};

export default function ExerciseGalleryPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Exercise Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Démo des 9 types d&apos;exercice avec grading en live. Temporaire — supprimée en Phase 7.
        </p>
      </header>
      <GalleryClient />
    </div>
  );
}
