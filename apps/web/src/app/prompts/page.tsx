"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { PromptFilters } from "@/components/prompts/PromptFilters";
import { PromptList } from "@/components/prompts/PromptList";
import { usePrompts } from "@/hooks/usePrompts";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/store";

const PromptsPage = () => {
  const router = useRouter();
  const { search, status, tagIds, sort } = useAppSelector((s) => s.ui.promptsFilter);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = usePrompts({
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    tagIds: tagIds.length > 0 ? tagIds : undefined,
    sort,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <PageHeader
        title="My Prompts"
        description="Manage, version, and test your LLM prompts."
        actions={
          <Button asChild size="sm">
            <Link href="/prompts/new">
              <Plus className="h-4 w-4 mr-1" />
              New Prompt
            </Link>
          </Button>
        }
      />

      <PromptFilters />

      {!isLoading && !isError && data && (
        <p className="text-xs text-muted-foreground">
          {data.total} {data.total === 1 ? "prompt" : "prompts"}
        </p>
      )}

      <PromptList
        prompts={data?.items}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onCreateClick={() => router.push("/prompts/new")}
      />
    </div>
  );
};

export default PromptsPage;
