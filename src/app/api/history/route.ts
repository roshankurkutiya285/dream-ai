import { NextResponse } from "next/server";
import { getSearchHistory, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ history: [], warning: "Supabase not configured" });
    }

    const history = await getSearchHistory();
    return NextResponse.json({ history });
  } catch (error) {
    console.error("History API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch search history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
