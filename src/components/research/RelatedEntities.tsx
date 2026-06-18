import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RelatedEntity } from "@/types/research";

interface RelatedEntitiesProps {
  entities: RelatedEntity[];
}

export function RelatedEntities({ entities }: RelatedEntitiesProps) {
  return (
    <Card title="Related People, Companies & Topics" icon={<Users className="h-5 w-5" />}>
      <ul className="space-y-3">
        {entities.map((entity, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
          >
            <Badge variant={entity.type}>{entity.type}</Badge>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {entity.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{entity.relevance}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
