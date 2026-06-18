import { List } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { KeyFact } from "@/types/research";

interface KeyFactsProps {
  facts: KeyFact[];
}

export function KeyFacts({ facts }: KeyFactsProps) {
  return (
    <Card title="Key Facts" icon={<List className="h-5 w-5" />}>
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {fact.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
