import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export function Card({ children, className, title, icon }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {icon && <span className="text-indigo-500">{icon}</span>}
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
