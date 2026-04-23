// Seed pedagogical content (lessons + seed exercises + flashcards) per topic.
//
// Usage:
//   npx tsx --env-file=.env.local scripts/seed.ts
//
// Idempotent: for each topic_id referenced in lib/content/*, all existing
// rows with created_by='seed' (exercises) or all rows (lessons, flashcards)
// are deleted first, then replaced with the current content. Running the
// script twice leaves the DB in the exact same state.

import { createClient } from "@supabase/supabase-js";
import { ALL_CONTENT } from "../lib/content/index";
import type { Database } from "../types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedTopic(content: typeof ALL_CONTENT[number]) {
  const { topic_id } = content;

  // Verify the topic exists before we dump content into it.
  const { data: topic, error: topicErr } = await admin
    .from("topics")
    .select("id")
    .eq("id", topic_id)
    .maybeSingle();
  if (topicErr) throw new Error(`topic lookup failed for ${topic_id}: ${topicErr.message}`);
  if (!topic) {
    console.warn(`  ! topic ${topic_id} not found in DB, skipping`);
    return { skipped: true as const };
  }

  // Clean previous seed content for this topic.
  await admin.from("lessons").delete().eq("topic_id", topic_id);
  await admin
    .from("exercises")
    .delete()
    .eq("topic_id", topic_id)
    .eq("created_by", "seed");
  await admin.from("flashcards").delete().eq("topic_id", topic_id);

  if (content.lessons.length > 0) {
    const { error } = await admin.from("lessons").insert(
      content.lessons.map((l, i) => ({
        topic_id,
        title: l.title,
        content_md: l.content_md,
        estimated_minutes: l.estimated_minutes,
        order_index: i,
      }))
    );
    if (error) throw new Error(`lessons insert for ${topic_id}: ${error.message}`);
  }

  if (content.exercises.length > 0) {
    const { error } = await admin.from("exercises").insert(
      content.exercises.map((e) => ({
        topic_id,
        type: e.type,
        difficulty: e.difficulty,
        question_md: e.question_md,
        data: e.data,
        explanation_md: e.explanation_md,
        colibrimo_connection: e.colibrimo_connection ?? null,
        created_by: "seed" as const,
      }))
    );
    if (error) throw new Error(`exercises insert for ${topic_id}: ${error.message}`);
  }

  if (content.flashcards.length > 0) {
    const { error } = await admin.from("flashcards").insert(
      content.flashcards.map((f) => ({
        topic_id,
        front_md: f.front_md,
        back_md: f.back_md,
        tags: f.tags ?? [],
      }))
    );
    if (error) throw new Error(`flashcards insert for ${topic_id}: ${error.message}`);
  }

  return {
    skipped: false as const,
    lessons: content.lessons.length,
    exercises: content.exercises.length,
    flashcards: content.flashcards.length,
  };
}

async function main() {
  console.log(`Seeding ${ALL_CONTENT.length} topics…`);
  let totalL = 0, totalE = 0, totalF = 0, skipped = 0;
  for (const content of ALL_CONTENT) {
    process.stdout.write(`· ${content.topic_id} … `);
    const res = await seedTopic(content);
    if (res.skipped) {
      skipped++;
      continue;
    }
    totalL += res.lessons;
    totalE += res.exercises;
    totalF += res.flashcards;
    console.log(`L=${res.lessons} E=${res.exercises} F=${res.flashcards}`);
  }
  console.log(
    `\nDone. Lessons=${totalL}, Exercises=${totalE}, Flashcards=${totalF}${
      skipped ? `, skipped=${skipped}` : ""
    }.`
  );
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
