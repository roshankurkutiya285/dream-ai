import { NextRequest, NextResponse } from "next/server";
import { generateResearchReport, isGeminiConfigured } from "@/lib/gemini/generate-report";
import { saveResearchSearch, isSupabaseConfigured } from "@/lib/supabase/server";
import type { QueryType } from "@/types/research";

const VALID_TYPES: QueryType[] = ["person", "company", "topic", "event"];

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { query, queryType } = body as { query?: string; queryType?: QueryType };

    if (!query?.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    if (!queryType || !VALID_TYPES.includes(queryType)) {
      return NextResponse.json(
        { error: "Invalid query type. Must be: person, company, topic, or event" },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Generate structured report via Gemini + Google Search
    const report = await generateResearchReport(trimmedQuery, queryType);

    // Persist to Supabase if configured, otherwise return without saving
    if (isSupabaseConfigured()) {
      const saved = await saveResearchSearch(
        trimmedQuery,
        queryType,
        report,
        report.sources
      );
      return NextResponse.json({ id: saved.id, report, query: trimmedQuery, queryType });
    }

    return NextResponse.json({
      id: null,
      report,
      query: trimmedQuery,
      queryType,
      warning: "Supabase not configured — report was not saved to history",
    });
  } catch (error) {
    console.error("Research API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate research report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
