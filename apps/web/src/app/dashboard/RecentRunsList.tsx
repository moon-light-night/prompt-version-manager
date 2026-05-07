import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPTY_RUNS_MESSAGE, LIST_SKELETON_COUNT, RECENT_RUNS_TITLE } from "./dashboard.constants";
import { ScoreStars } from "./ScoreStars";
import type { RecentRunsListProps } from "./dashboard.types";

export const RecentRunsList = ({ items, isLoading }: RecentRunsListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{RECENT_RUNS_TITLE}</h2>
      </div>
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: LIST_SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-3 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : items && items.length > 0
            ? items.map((run) => (
                <Link
                  key={run.id}
                  href={`/prompts/${run.promptId}/test-cases/${run.testCaseId}/runs`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-accent-foreground">{run.testCaseName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {run.promptTitle} · v{run.versionNumber} · {formatDistanceToNow(new Date(run.ranAt), { addSuffix: true })}
                    </p>
                  </div>
                  <ScoreStars score={run.score} />
                </Link>
              ))
            : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">{EMPTY_RUNS_MESSAGE}</p>
                </div>
              )}
      </div>
    </section>
  );
};
