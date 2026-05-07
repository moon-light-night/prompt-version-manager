import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { GitCommitHorizontal, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VariablePill } from "./VariablePill";
import type { PromptVersion } from "@pvm/shared";

interface VersionCardProps {
  version: PromptVersion;
  promptId: string;
  onSelectForCompare?: (id: string) => void;
  isSelectedForCompare?: boolean;
}

export const VersionCard = ({
  version,
  promptId,
  onSelectForCompare,
  isSelectedForCompare,
}: VersionCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(version.createdAt), { addSuffix: true });

  return (
    <div
      data-testid="version-card"
      className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GitCommitHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <Link
            href={`/prompts/${promptId}/versions/${version.id}`}
            className="font-semibold text-sm hover:underline truncate"
          >
            v{version.versionNumber}
          </Link>
          {version.label && (
            <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
              <Tag className="h-3 w-3" />
              {version.label}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
      </div>

      <p className="text-xs text-muted-foreground font-mono line-clamp-3 bg-muted rounded px-3 py-2">
        {version.content}
      </p>

      {version.variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {version.variables.map((v) => (
            <VariablePill key={v} name={v} />
          ))}
        </div>
      )}

      {onSelectForCompare && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant={isSelectedForCompare ? "default" : "outline"}
            onClick={() => onSelectForCompare(version.id)}
            data-testid="select-compare-btn"
          >
            {isSelectedForCompare ? "Selected" : "Select for compare"}
          </Button>
        </div>
      )}
    </div>
  );
};
