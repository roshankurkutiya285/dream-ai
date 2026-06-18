import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ResearchReport, QueryType } from "@/types/research";
import { QUERY_TYPE_LABELS } from "@/types/research";
import { Badge } from "@/components/ui/Badge";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { Timeline } from "./Timeline";
import { KeyFacts } from "./KeyFacts";
import { SourceList } from "./SourceList";
import { RelatedEntities } from "./RelatedEntities";
import { QuestionsSection } from "./QuestionsSection";

interface ReportDashboardProps {
  query: string;
  queryType: QueryType;
  report: ResearchReport;
  createdAt?: string;
}

export function ReportDashboard({ query, queryType, report, createdAt }: ReportDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Report header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={queryType}>{QUERY_TYPE_LABELS[queryType]}</Badge>
            {createdAt && (
              <span className="text-xs text-zinc-400">
                {new Date(createdAt).toLocaleString()}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {query}
          </h1>
        </div>
      </div>

      {/* Report sections */}
      <ExecutiveSummary summary={report.executiveSummary} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Timeline events={report.timeline} />
        <KeyFacts facts={report.keyFacts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SourceList sources={report.sources} />
        <RelatedEntities entities={report.relatedEntities} />
      </div>

      <QuestionsSection
        researchQuestions={report.researchQuestions}
        interviewQuestions={report.interviewQuestions}
        deepDiveQuestions={report.deepDiveQuestions}
      />
    </div>
  );
}
