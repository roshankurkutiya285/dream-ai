"use client";

import { useState } from "react";
import { Sparkles, History } from "lucide-react";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchHistory } from "@/components/history/SearchHistory";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
          <Sparkles className="h-3 w-3" />
          AI-Powered Research Intelligence
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Research anything in minutes
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-zinc-500">
          Generate structured intelligence reports on people, companies, topics, and events —
          with timelines, sources, and interview questions.
        </p>
      </div>

      {/* Search form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <SearchForm onError={setError} />
      </div>

      {/* Inline error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Search history */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Recent Searches
          </h2>
        </div>
        <SearchHistory />
      </div>
    </div>
  );
}
