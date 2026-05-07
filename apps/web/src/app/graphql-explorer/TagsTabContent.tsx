import { Skeleton } from "@/components/ui/skeleton";
import { TagBadge } from "@/components/tags/TagBadge";
import { GraphQLErrorMessage } from "./GraphQLErrorMessage";
import { GraphQLQueryPanel } from "./GraphQLQueryPanel";
import { TAGS_QUERY, TAGS_SKELETON_COUNT } from "./graphql-explorer.constants";
import type { TagsData } from "./graphql-explorer.types";

interface TagsTabContentProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: TagsData;
}

export const TagsTabContent = ({ isLoading, isError, error, data }: TagsTabContentProps) => {
  return (
    <div className="space-y-4">
      <GraphQLQueryPanel query={TAGS_QUERY} />

      {isError && <GraphQLErrorMessage error={error} />}

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: TAGS_SKELETON_COUNT }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.tags.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No tags yet. Add tags from the prompt detail page.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data?.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} size="md" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
