import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildSearchIndex } from "@/lib/search/build-index";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "non authentifié" }, { status: 401 });
  }
  const items = await buildSearchIndex(supabase);
  return NextResponse.json(
    { items },
    {
      headers: {
        // Content is static-ish (seeded), cache 10 minutes per user.
        "Cache-Control": "private, max-age=600",
      },
    },
  );
}
