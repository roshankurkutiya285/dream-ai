import { NextRequest, NextResponse } from "next/server";
import { getResearchSearch, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      );
    }

    const { id } = await params;
    const search = await getResearchSearch(id);
    return NextResponse.json(search);
  } catch (error) {
    console.error("Research fetch error:", error);
    const message =
      error instanceof Error ? error.message : "Research not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
