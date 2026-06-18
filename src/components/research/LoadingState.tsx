import { Loader2, Search } from "lucide-react";

export function LoadingState({ query }: { query?: string }) {
  const steps = [
    "Searching external sources…",
    "Analyzing information…",
    "Building timeline…",
    "Generating insights…",
    "Compiling report…",
  ];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950">
          <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <Loader2 className="absolute -right-2 -top-2 h-6 w-6 animate-spin text-indigo-500" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Researching{query ? `: ${query}` : "…"}
      </h2>
      <p className="mb-8 text-sm text-zinc-500">This usually takes 15–30 seconds</p>

      <ul className="w-full max-w-sm space-y-3">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
