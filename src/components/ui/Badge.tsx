import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "person" | "company" | "topic" | "event";
  className?: string;
}

const variantStyles = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  person: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  company: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  topic: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  event: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
