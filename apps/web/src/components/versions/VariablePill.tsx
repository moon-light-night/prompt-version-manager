import { cn } from "@/lib/utils";

interface VariablePillProps {
  name: string;
  variant?: "default" | "added" | "removed";
  className?: string;
}

export const VariablePill = ({ name, variant = "default", className }: VariablePillProps) => {
  return (
    <span
      data-testid="variable-pill"
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border",
        variant === "default" && "bg-violet-50 text-violet-700 border-violet-200",
        variant === "added" && "bg-green-50 text-green-700 border-green-200",
        variant === "removed" && "bg-red-50 text-red-700 border-red-200 line-through opacity-70",
        className,
      )}
    >
      {"{{"}{name}{"}}"}
    </span>
  );
};
