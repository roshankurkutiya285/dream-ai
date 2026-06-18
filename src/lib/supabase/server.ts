import { createClient } from "@supabase/supabase-js";
import type { ResearchReport, Source, QueryType } from "@/types/research";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Check if Supabase is configured with valid credentials */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Server-side Supabase client for API routes */
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Save a completed research search to the database */
export async function saveResearchSearch(
  query: string,
  queryType: QueryType,
  report: ResearchReport,
  sources: Source[]
) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("research_searches")
    .insert({
      query,
      query_type: queryType,
      report,
      sources,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save research: ${error.message}`);
  return data;
}

/** Fetch a single research search by ID */
export async function getResearchSearch(id: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("research_searches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Research not found: ${error.message}`);
  return data;
}

/** Fetch recent search history */
export async function getSearchHistory(limit = 20) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("research_searches")
    .select("id, query, query_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch history: ${error.message}`);
  return data;
}
