"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { VersionCard } from "./VersionCard";
import type { PromptVersion } from "@pvm/shared";

interface VersionListProps {
  promptId: string;
  versions: PromptVersion[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  selectedIds?: string[];
  onSelectForCompare?: (id: string) => void;
}

export const VersionList = ({
  promptId,
  versions,
  isLoading,
  isError,
  onRetry,
  selectedIds = [],
  onSelectForCompare,
}: VersionListProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load versions"
        message="Could not fetch version history."
        onRetry={onRetry}
      />
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <EmptyState
        title="No versions yet"
        description="Create the first version for this prompt to start tracking changes."
        action={{
          label: "Create first version",
          onClick: () => router.push(`/prompts/${promptId}/versions/new`),
        }}
      />
    );
  }

  return (
    <div data-testid="version-list" className="space-y-3">
      {versions.map((v) => (
        <VersionCard
          key={v.id}
          version={v}
          promptId={promptId}
          onSelectForCompare={onSelectForCompare}
          isSelectedForCompare={selectedIds.includes(v.id)}
        />
      ))}
    </div>
  );
};
