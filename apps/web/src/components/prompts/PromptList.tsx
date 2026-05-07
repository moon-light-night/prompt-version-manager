"use client";

import { Layers } from "lucide-react";
import { PromptCard } from "./PromptCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import type { PromptWithMeta } from "@pvm/shared";

interface PromptListProps {
  prompts?: PromptWithMeta[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  onCreateClick?: () => void;
}

const PromptListSkeleton = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PromptList = ({
  prompts,
  isLoading,
  isError,
  onRetry,
  onCreateClick,
}: PromptListProps) => {
  if (isLoading) {
    return <PromptListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load prompts"
        message="Could not connect to the API. Make sure the backend is running."
        onRetry={onRetry}
      />
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No prompts yet"
        description="Create your first prompt to start managing versions and test cases."
        action={
          onCreateClick
            ? { label: "Create your first prompt", onClick: onCreateClick }
            : undefined
        }
      />
    );
  }

  return (
    <div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="prompt-list"
    >
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};
