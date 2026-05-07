import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "@/components/prompts/StatusBadge";
import type { PromptWithMeta } from "@pvm/shared";

interface PromptMetaRowProps {
  prompt: PromptWithMeta;
}

export const PromptMetaRow = ({ prompt }: PromptMetaRowProps) => {
  const timeAgo = formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true });

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <StatusBadge status={prompt.status} />
      <span className="text-xs text-muted-foreground">
        {prompt.versionCount} {prompt.versionCount === 1 ? "version" : "versions"}
      </span>
      <span className="text-muted-foreground text-xs">·</span>
      <span className="text-xs text-muted-foreground">
        {prompt.testCaseCount} test {prompt.testCaseCount === 1 ? "case" : "cases"}
      </span>
      <span className="text-muted-foreground text-xs">·</span>
      <span className="text-xs text-muted-foreground">updated {timeAgo}</span>
    </div>
  );
};
