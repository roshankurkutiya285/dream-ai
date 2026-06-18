import { ReportDashboard } from "@/components/research/ReportDashboard";
import { ErrorState } from "@/components/research/ErrorState";
import { getResearchSearch, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ResearchReport, QueryType } from "@/types/research";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResearchPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ErrorState message="Supabase is not configured. Reports cannot be loaded by ID." />
      </div>
    );
  }

  let data = null;
  try {
    data = await getResearchSearch(id);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ErrorState message="Research report not found. It may have been deleted or the link is invalid." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <ReportDashboard
        query={data.query}
        queryType={data.query_type as QueryType}
        report={data.report as ResearchReport}
        createdAt={data.created_at}
      />
    </div>
  );
}
