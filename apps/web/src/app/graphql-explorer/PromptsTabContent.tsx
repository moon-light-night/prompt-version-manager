import Link from "next/link";
import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TagBadge } from "@/components/tags/TagBadge";
import { GraphQLErrorMessage } from "./GraphQLErrorMessage";
import { GraphQLQueryPanel } from "./GraphQLQueryPanel";
import { PROMPTS_QUERY, PROMPTS_SKELETON_COUNT } from "./graphql-explorer.constants";
import type { PromptsData } from "./graphql-explorer.types";

interface PromptsTabContentProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: PromptsData;
}

export const PromptsTabContent = ({ isLoading, isError, error, data }: PromptsTabContentProps) => {
  return (
    <div className="space-y-4">
      <GraphQLQueryPanel query={PROMPTS_QUERY} />

      {isError && <GraphQLErrorMessage error={error} />}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: PROMPTS_SKELETON_COUNT }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {data?.prompts.total ?? 0} total prompts (showing {data?.prompts.items.length ?? 0})
          </p>
          <div className="space-y-2">
            {data?.prompts.items.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-lg border border-border bg-card p-4 space-y-2"
                data-testid="gql-prompt-item"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/prompts/${prompt.id}`}
                    className="text-sm font-semibold hover:underline truncate"
                  >
                    {prompt.title}
                  </Link>
                  <Badge variant={prompt.status === "active" ? "default" : "secondary"} className="text-xs shrink-0">
                    {prompt.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3" /> {prompt.versionCount} versions
                  </span>
                  {prompt.latestVersion && (
                    <span>
                      v{prompt.latestVersion.versionNumber}
                      {prompt.latestVersion.label ? ` · ${prompt.latestVersion.label}` : ""}
                    </span>
                  )}
                  {prompt.latestVersion && prompt.latestVersion.variables.length > 0 && (
                    <span>{prompt.latestVersion.variables.map((variable) => `{{${variable}}}`).join(", ")}</span>
                  )}
                </div>
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
                  </div>
                )}
              </div>
            ))}
            {data?.prompts.items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No prompts found. <Link href="/prompts/new" className="text-primary hover:underline">Create one</Link>.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
