import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PromptRun } from "@pvm/shared";

interface RunCardProps {
  run: PromptRun;
  versionLabel?: string;
  testCaseName?: string;
}

const scoreColors: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-yellow-100 text-yellow-700 border-yellow-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-green-100 text-green-700 border-green-200",
};

const scoreLabels: Record<number, string> = {
  1: "Very bad",
  2: "Poor",
  3: "OK",
  4: "Good",
  5: "Excellent",
};

export const RunCard = ({ run, versionLabel, testCaseName }: RunCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(run.ranAt), { addSuffix: true });

  return (
    <div
      data-testid="run-card"
      className="rounded-lg border border-border bg-card p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {testCaseName && (
            <span className="text-sm font-semibold truncate">{testCaseName}</span>
          )}
          {versionLabel && (
            <Badge variant="secondary" className="text-xs">
              {versionLabel}
            </Badge>
          )}
          {run.status === "error" && (
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {timeAgo}
        </span>
      </div>

      {run.score !== null && run.score !== undefined && (
        <div className="flex items-center gap-2">
          <div
            className={[
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
              scoreColors[run.score] ?? "bg-gray-100 text-gray-600 border-gray-200",
            ].join(" ")}
            data-testid="run-score"
          >
            <Star className="h-3 w-3" />
            {run.score}/5 — {scoreLabels[run.score] ?? ""}
          </div>
        </div>
      )}

      <div className="rounded-md bg-muted p-3">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Actual output</p>
        <p className="text-sm font-mono whitespace-pre-wrap break-words line-clamp-6">
          {run.actualOutput}
        </p>
      </div>

      {run.notes && (
        <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
          {run.notes}
        </p>
      )}
    </div>
  );
};
