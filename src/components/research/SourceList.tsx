import { ExternalLink, Link2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Source } from "@/types/research";

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <Card title="Sources" icon={<Link2 className="h-5 w-5" />}>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg border border-zinc-100 p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-zinc-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 group-hover:text-indigo-500" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 group-hover:text-indigo-700 dark:text-zinc-100 dark:group-hover:text-indigo-300">
                  {source.title}
                </p>
                {source.snippet && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{source.snippet}</p>
                )}
                <p className="mt-1 truncate text-xs text-indigo-500">{source.url}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
