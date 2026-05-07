"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { RunForm } from "@/components/runs/RunForm";
import { useTestCase } from "@/hooks/useTestCases";
import { useVersion, useVersions } from "@/hooks/useVersions";
import { useCreateRun } from "@/hooks/usePromptRuns";
import { toast } from "@/lib/use-toast";
import type { RunFormValues } from "@/components/runs/RunForm";
import {
  BACK_TO_TEST_CASES_LABEL,
  LOAD_TEST_CASE_ERROR_MESSAGE,
  RUN_SAVE_FAILED_TITLE,
  RUN_SAVED_TITLE,
  SELECT_VERSION_FIRST_TITLE,
} from "../../test-case-pages.constants";
import type { PromptTestCasePageProps, RunPageInnerProps } from "../../test-case-pages.types";

const RunPageInner = ({ promptId, tcId }: RunPageInnerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");

  const { data: testCase, isLoading: tcLoading, isError: tcError, refetch: tcRefetch }
    = useTestCase(tcId);
  const { data: version, isLoading: vLoading } = useVersion(versionId);
  const { data: versions, isLoading: versionsLoading } = useVersions(promptId);
  const createRun = useCreateRun(promptId, versionId ?? undefined);

  const handleSubmit = (values: RunFormValues) => {
    if (!versionId) {
      toast({ variant: "destructive", title: SELECT_VERSION_FIRST_TITLE });
      return;
    }
    createRun.mutate(
      {
        testCaseId: tcId,
        versionId,
        actualOutput: values.actualOutput,
        score: values.score ?? undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: RUN_SAVED_TITLE });
          router.push(`/prompts/${promptId}/test-cases/${tcId}/runs`);
        },
        onError: () => {
          toast({ variant: "destructive", title: RUN_SAVE_FAILED_TITLE });
        },
      }
    );
  };

  if (tcLoading || versionsLoading) return <LoadingState />;
  if (tcError || !testCase) {
    return <ErrorState message={LOAD_TEST_CASE_ERROR_MESSAGE} onRetry={() => tcRefetch()} />;
  }

  const activeVersionId = versionId ?? versions?.[0]?.id ?? null;
  const activeVersion = version ?? versions?.find(v => v.id === activeVersionId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/prompts/${promptId}/test-cases`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {BACK_TO_TEST_CASES_LABEL}
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Run: ${testCase.name}`}
        description={activeVersion ? `Version v${activeVersion.versionNumber}${activeVersion.label ? ` · ${activeVersion.label}` : ""}` : undefined}
      />

      {versions && versions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Version:</span>
          {versions.map((v) => (
            <Button
              key={v.id}
              variant={activeVersionId === v.id ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/prompts/${promptId}/test-cases/${tcId}/run?versionId=${v.id}`}>
                v{v.versionNumber}{v.label ? ` · ${v.label}` : ""}
              </Link>
            </Button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <RunForm
          promptContent={activeVersion?.content}
          inputValues={testCase.inputValues}
          onSubmit={handleSubmit}
          isSubmitting={createRun.isPending || vLoading}
          onCancel={() => router.push(`/prompts/${promptId}/test-cases`)}
        />
      </div>
    </div>
  );
};

const RunPage = ({ params }: PromptTestCasePageProps) => {
  const { id: promptId, tcId } = params;
  return (
    <Suspense fallback={<LoadingState />}>
      <RunPageInner promptId={promptId} tcId={tcId} />
    </Suspense>
  );
};

export default RunPage;
