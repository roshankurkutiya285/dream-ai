"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { QueryType } from "@/types/research";
import { QUERY_TYPE_LABELS } from "@/types/research";
import { Badge } from "@/components/ui/Badge";

interface HistoryItem {
  id: string;
  query: string;
  query_type: QueryType;
  created_at: string;
}

export function SearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No previous searches yet. Start your first research above.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {history.map((item) => (
        <li key={item.id}>
          <Link
            href={`/research/${item.id}`}
            className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Badge variant={item.query_type}>{QUERY_TYPE_LABELS[item.query_type]}</Badge>
              <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.query}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="h-3 w-3" />
              {new Date(item.created_at).toLocaleDateString()}
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
