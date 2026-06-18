import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ExecutiveSummaryProps {
  summary: string;
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <Card title="Executive Summary" icon={<FileText className="h-5 w-5" />}>
      <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {summary.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}
