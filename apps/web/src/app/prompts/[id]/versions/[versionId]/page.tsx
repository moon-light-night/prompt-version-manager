"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { VariablePill } from "@/components/versions/VariablePill";
import { useVersion } from "@/hooks/useVersions";
import type { VersionDetailPageProps } from "../page.types";

const VersionDetailPage = ({ params }: VersionDetailPageProps) => {
  const { id: promptId, versionId } = params;
  const { data: version, isLoading, isError, refetch } = useVersion(versionId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !version) {
    return (
      <ErrorState
        title="Version not found"
        message="This version does not exist or could not be loaded."
        onRetry={refetch}
      />
    );
  }

  const title = version.label
    ? `v${version.versionNumber} — ${version.label}`
    : `v${version.versionNumber}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/prompts/${promptId}/versions`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Version history
          </Link>
        </Button>
      </div>

      <PageHeader
        title={title}
        description={`Created ${formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}`}
      />

      <div className="rounded-lg border border-border p-4 bg-muted">
        <p className="text-xs font-medium text-muted-foreground mb-3">Prompt content</p>
        <pre className="font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
          {version.content}
        </pre>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          Variables{" "}
          <span className="text-muted-foreground font-normal">({version.variables.length})</span>
        </p>
        {version.variables.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No variables in this version.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {version.variables.map((v) => (
              <VariablePill key={v} name={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionDetailPage;
