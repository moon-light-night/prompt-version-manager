"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, GitCompareArrows, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { VersionList } from "@/components/versions/VersionList";
import { useVersions } from "@/hooks/useVersions";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCompareVersionIds, clearCompareVersionIds } from "@/store/slices/uiSlice";
import { toast } from "@/lib/use-toast";
import type { VersionHistoryPageProps } from "./page.types";

const VersionHistoryPage = ({ params }: VersionHistoryPageProps) => {
  const { id: promptId } = params;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pendingCompareId, setPendingCompareId] = useState<string | null>(null);

  const compareVersionIds = useAppSelector((s) => s.ui.compareVersionIds);
  const selectedIds: string[] = compareVersionIds ?? (pendingCompareId ? [pendingCompareId] : []);

  const { data: versions, isLoading, isError, refetch } = useVersions(promptId);

  const handleSelectForCompare = (versionId: string) => {
    if (compareVersionIds) {
      if (compareVersionIds.includes(versionId)) {
        dispatch(clearCompareVersionIds());
      } else {
        toast({ variant: "destructive", title: "Two versions already selected", description: "Deselect one first." });
      }
      return;
    }

    if (pendingCompareId === null) {
      setPendingCompareId(versionId);
      return;
    }

    if (pendingCompareId === versionId) {
      setPendingCompareId(null);
      return;
    }

    dispatch(setCompareVersionIds([pendingCompareId, versionId]));
    setPendingCompareId(null);
  };

  const handleClearCompare = () => {
    setPendingCompareId(null);
    dispatch(clearCompareVersionIds());
  };

  const canCompare = compareVersionIds !== null;

  const handleNavigateToCompare = () => {
    if (!compareVersionIds) {
      return;
    }
    router.push(`/prompts/${promptId}/versions/compare?a=${compareVersionIds[0]}&b=${compareVersionIds[1]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/prompts/${promptId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to prompt
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Version history"
        description="Browse past versions or create a new one."
        actions={
          <Button asChild>
            <Link href={`/prompts/${promptId}/versions/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New version
            </Link>
          </Button>
        }
      />

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3 gap-3">
          <p className="text-sm text-muted-foreground">
            {canCompare
              ? "2 versions selected — ready to compare."
              : "Select a second version to compare."}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleClearCompare}>
              Clear
            </Button>
            {canCompare && (
              <Button size="sm" onClick={handleNavigateToCompare}>
                <GitCompareArrows className="h-4 w-4 mr-2" />
                Compare
              </Button>
            )}
          </div>
        </div>
      )}

      <VersionList
        promptId={promptId}
        versions={versions}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        selectedIds={selectedIds}
        onSelectForCompare={handleSelectForCompare}
      />
    </div>
  );
};

export default VersionHistoryPage;
