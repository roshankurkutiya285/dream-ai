"use client";

import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QueryType } from "@/types/research";
import { QUERY_TYPE_LABELS, QUERY_TYPE_PLACEHOLDERS } from "@/types/research";
import { cn } from "@/lib/utils/cn";

const QUERY_TYPES: QueryType[] = ["person", "company", "topic", "event"];

interface SearchFormProps {
  onError?: (message: string) => void;
}

export function SearchForm({ onError }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState<QueryType>("person");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    onError?.("");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), queryType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Research failed");
      }

      if (data.id) {
        router.push(`/research/${data.id}`);
      } else {
        // Supabase not configured — store in sessionStorage and redirect
        sessionStorage.setItem("latest_report", JSON.stringify(data));
        router.push("/research/latest");
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Query type selector */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUERY_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setQueryType(type)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
              queryType === type
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
            )}
          >
            {QUERY_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={QUERY_TYPE_PLACEHOLDERS[queryType]}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-4 pr-12 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          disabled={loading}
          required
        />
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Researching…
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Generate Research Report
          </>
        )}
      </button>
    </form>
  );
}
