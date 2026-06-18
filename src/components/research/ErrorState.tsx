import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message: string;
  showHomeLink?: boolean;
}

export function ErrorState({ message, showHomeLink = true }: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-sm text-zinc-500">{message}</p>
      {showHomeLink && (
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Back to Search
        </Link>
      )}
    </div>
  );
}
