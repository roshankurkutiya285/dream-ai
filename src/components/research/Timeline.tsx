import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { TimelineEvent } from "@/types/research";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <Card title="Timeline of Important Events" icon={<Calendar className="h-5 w-5" />}>
      <ol className="relative space-y-0">
        {events.map((event, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {i < events.length - 1 && (
              <span className="absolute left-[5px] top-3 h-full w-px bg-zinc-200 dark:bg-zinc-700" />
            )}
            {/* Dot */}
            <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {event.date}
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {event.title}
                </h3>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
