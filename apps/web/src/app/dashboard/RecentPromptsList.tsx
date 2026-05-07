import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/prompts/StatusBadge";
import {
  CREATE_FIRST_PROMPT_LABEL,
  EMPTY_PROMPTS_MESSAGE,
  LIST_SKELETON_COUNT,
  RECENT_PROMPTS_TITLE,
  VIEW_ALL_LABEL,
} from "./dashboard.constants";
import type { RecentPromptsListProps } from "./dashboard.types";

export const RecentPromptsList = ({ items, isLoading }: RecentPromptsListProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{RECENT_PROMPTS_TITLE}</h2>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link href="/prompts">
            {VIEW_ALL_LABEL} <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: LIST_SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-3 space-y-1.5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))
          : items && items.length > 0
            ? items.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-accent-foreground">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {prompt.versionCount} {prompt.versionCount === 1 ? "version" : "versions"} ·{" "}
                      {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={prompt.status} />
                </Link>
              ))
            : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">{EMPTY_PROMPTS_MESSAGE}</p>
                  <Button size="sm" className="mt-2" asChild>
                    <Link href="/prompts/new">{CREATE_FIRST_PROMPT_LABEL}</Link>
                  </Button>
                </div>
              )}
      </div>
    </section>
  );
};
