"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { RunCard } from "@/components/runs/RunCard";
import { useTestCase } from "@/hooks/useTestCases";
import { useRunsByTestCase } from "@/hooks/usePromptRuns";
import { useVersions } from "@/hooks/useVersions";
import type { PromptRun, PromptVersion } from "@pvm/shared";
import {
  BACK_TO_TEST_CASES_LABEL,
  NEW_RUN_LABEL,
  RECORD_FIRST_RUN_LABEL,
  RUN_AGAIN_LABEL,
  RUN_HISTORY_EMPTY_DESCRIPTION,
  RUN_HISTORY_EMPTY_TITLE,
  RUN_HISTORY_LOAD_FAILED_DESCRIPTION,
  RUN_HISTORY_LOAD_FAILED_TITLE,
} from "../../test-case-pages.constants";
import type { PromptTestCasePageProps } from "../../test-case-pages.types";

const RunHistoryPage = ({ params }: PromptTestCasePageProps) => {
  const { id: promptId, tcId } = params;
  const router = useRouter();
  const { data: testCase, isLoading: tcLoading } = useTestCase(tcId);
  const { data: runs, isLoading: runsLoading, isError } = useRunsByTestCase(tcId);
  const { data: versions, isLoading: versionsLoading } = useVersions(promptId);

  const versionMap = useMemo(
    () => new Map<string, PromptVersion>((versions ?? []).map((version) => [version.id, version])),
    [versions],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, PromptRun[]>();
    for (const run of runs ?? []) {
      const bucket = map.get(run.versionId) ?? [];
      bucket.push(run);
      map.set(run.versionId, bucket);
    }
    return map;
  }, [runs]);

  if (tcLoading || runsLoading || versionsLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        title={RUN_HISTORY_LOAD_FAILED_TITLE}
        message={RUN_HISTORY_LOAD_FAILED_DESCRIPTION}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/prompts/${promptId}/test-cases`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {BACK_TO_TEST_CASES_LABEL}
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Run history: ${testCase?.name ?? "…"}`}
        actions={
          <Button size="sm" asChild>
            <Link href={`/prompts/${promptId}/test-cases/${tcId}/run`}>
              <Play className="h-4 w-4 mr-1" />
              {NEW_RUN_LABEL}
            </Link>
          </Button>
        }
      />

      {grouped.size === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Play}
            title={RUN_HISTORY_EMPTY_TITLE}
            description={RUN_HISTORY_EMPTY_DESCRIPTION}
            action={{
              label: RECORD_FIRST_RUN_LABEL,
              onClick: () => router.push(`/prompts/${promptId}/test-cases/${tcId}/run`),
            }}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Array.from(grouped.entries()).map(([versionId, versionRuns]) => {
            const version = versionMap.get(versionId);
            const label = version
              ? `v${version.versionNumber}${version.label ? ` — ${version.label}` : ""}`
              : `Version ${versionId.slice(0, 8)}`;

            return (
              <div key={versionId}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">{label}</h3>
                  {version && (
                    <Button size="sm" variant="ghost" asChild>
                      <Link
                        href={`/prompts/${promptId}/test-cases/${tcId}/run?versionId=${versionId}`}
                      >
                        <Play className="h-3.5 w-3.5 mr-1" />
                        {RUN_AGAIN_LABEL}
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {versionRuns.map((run) => (
                    <RunCard key={run.id} run={run} versionLabel={label} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RunHistoryPage;
