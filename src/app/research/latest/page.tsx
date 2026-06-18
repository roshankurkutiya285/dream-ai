"use client";

import { useState } from "react";
import { ReportDashboard } from "@/components/research/ReportDashboard";
import { ErrorState } from "@/components/research/ErrorState";
import type { ResearchReport, QueryType } from "@/types/research";

interface StoredReport {
  query: string;
  queryType: QueryType;
  report: ResearchReport;
}

function readStoredReport(): StoredReport | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("latest_report");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as StoredReport;
  } catch {
    return null;
  }
}

/** Fallback page when Supabase is not configured — reads from sessionStorage */
export default function LatestResearchPage() {
  const [data] = useState(readStoredReport);

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ErrorState message="No report found. Generate a new research report from the home page." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <ReportDashboard query={data.query} queryType={data.queryType} report={data.report} />
    </div>
  );
}
