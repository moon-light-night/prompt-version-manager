interface VariableBadgeProps {
  name: string;
  className?: string;
}

export function VariableBadge({ name, className = "" }: VariableBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 px-2 py-0.5 text-xs font-medium font-mono ${className}`}
    >
      {"{{"}
      {name}
      {"}}"}
    </span>
  );
}
