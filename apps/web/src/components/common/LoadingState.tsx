import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  fullPage?: boolean;
  skeleton?: boolean;
  rows?: number;
  className?: string;
}

export const LoadingState = ({
  fullPage = false,
  skeleton = false,
  rows = 4,
  className,
}: LoadingStateProps) => {
  if (skeleton) {
    return (
      <div className={cn("space-y-3", className)} data-testid="loading-state">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullPage ? "min-h-[400px]" : "py-12",
        className,
      )}
      data-testid="loading-state"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
