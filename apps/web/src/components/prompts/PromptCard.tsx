"use client";

import Link from "next/link";
import { GitBranch, FlaskConical, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TagBadge } from "@/components/tags/TagBadge";
import { useArchivePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import { useState } from "react";
import type { PromptWithMeta } from "@pvm/shared";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: PromptWithMeta;
  className?: string;
}

export const PromptCard = ({ prompt, className }: PromptCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const archiveMutation = useArchivePrompt();

  const timeAgo = formatDistanceToNow(new Date(prompt.updatedAt), {
    addSuffix: true,
  });

  const handleArchive = () => {
    archiveMutation.mutate(prompt.id, {
      onSuccess: () => {
        toast({
          title: "Prompt archived",
          description: `"${prompt.title}" has been archived.`,
        });
        setConfirmOpen(false);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Archive failed",
          description: "Could not archive the prompt. Please try again.",
        });
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm",
          prompt.status === "archived" && "opacity-60",
          className,
        )}
        data-testid="prompt-card"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/prompts/${prompt.id}`}
              className="line-clamp-1 text-sm font-semibold text-foreground hover:underline"
            >
              {prompt.title}
            </Link>
            {prompt.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {prompt.description}
              </p>
            )}
          </div>

          {prompt.status === "active" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Archive prompt"
              onClick={() => setConfirmOpen(true)}
              aria-label="Archive prompt"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={prompt.status} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitBranch className="h-3 w-3" />
            {prompt.versionCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <FlaskConical className="h-3 w-3" />
            {prompt.testCaseCount}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Archive prompt?"
        description={`"${prompt.title}" will be archived and hidden from the active list. You can filter for archived prompts at any time.`}
        destructive
        loading={archiveMutation.isPending}
        onConfirm={handleArchive}
      />
    </>
  );
};
