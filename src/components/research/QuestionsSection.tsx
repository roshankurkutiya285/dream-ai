import { HelpCircle, Mic, Microscope } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface QuestionGroup {
  title: string;
  questions: string[];
  icon: React.ReactNode;
}

interface QuestionsSectionProps {
  researchQuestions: string[];
  interviewQuestions: string[];
  deepDiveQuestions: string[];
}

function QuestionCard({ title, questions, icon }: QuestionGroup) {
  return (
    <Card title={title} icon={icon}>
      <ol className="space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="shrink-0 font-mono text-xs text-indigo-500">{i + 1}.</span>
            <span>{q}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function QuestionsSection({
  researchQuestions,
  interviewQuestions,
  deepDiveQuestions,
}: QuestionsSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <QuestionCard
        title="Research Questions"
        questions={researchQuestions}
        icon={<HelpCircle className="h-5 w-5" />}
      />
      <QuestionCard
        title="Interview Questions"
        questions={interviewQuestions}
        icon={<Mic className="h-5 w-5" />}
      />
      <QuestionCard
        title="Deep-Dive Questions"
        questions={deepDiveQuestions}
        icon={<Microscope className="h-5 w-5" />}
      />
    </div>
  );
}
