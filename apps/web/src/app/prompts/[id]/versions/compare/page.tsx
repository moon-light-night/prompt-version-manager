"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { DiffViewer } from "@/components/versions/DiffViewer";
import { VariablePill } from "@/components/versions/VariablePill";
import { useCompareVersions } from "@/hooks/useVersions";
import type { VersionComparePageProps } from "../page.types";

const CompareVersionsPage = ({ params }: VersionComparePageProps) => {
  const { id: promptId } = params;
  const searchParams = useSearchParams();
  const versionAId = searchParams.get("a");
  const versionBId = searchParams.get("b");

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useCompareVersions(versionAId, versionBId);

  if (!versionAId || !versionBId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <ErrorState
          title="Versions not specified"
          message="Please select two versions to compare from the history page."
        />
        <Button asChild>
          <Link href={`/prompts/${promptId}/versions`}>Go to history</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !result) {
    return (
      <ErrorState
        title="Could not load comparison"
        message="Failed to compare these two versions."
        onRetry={refetch}
      />
    );
  }

  const { versionA, versionB, diff, addedVariables, removedVariables } = result;
  const compareTitle = `v${versionA.versionNumber} → v${versionB.versionNumber}`;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/prompts/${promptId}/versions`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Version history
          </Link>
        </Button>
      </div>

      <PageHeader
        title={compareTitle}
        description="Line-by-line diff between two prompt versions."
      />

      {(addedVariables.length > 0 || removedVariables.length > 0) && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Variable changes</p>
          {removedVariables.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center">Removed:</span>
              {removedVariables.map((v: string) => (
                <VariablePill key={v} name={v} variant="removed" />
              ))}
            </div>
          )}
          {addedVariables.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center">Added:</span>
              {addedVariables.map((v: string) => (
                <VariablePill key={v} name={v} variant="added" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground">
        <span className="text-red-600">
          v{versionA.versionNumber}
          {versionA.label ? ` — ${versionA.label}` : ""}
        </span>
        <span className="text-green-600 text-right">
          v{versionB.versionNumber}
          {versionB.label ? ` — ${versionB.label}` : ""}
        </span>
      </div>

      <DiffViewer diff={diff} />
    </div>
  );
};

export default CompareVersionsPage;
