"use client";

import Link from "next/link";
import { ArrowLeft, FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { TestCaseCard } from "@/components/testCases/TestCaseCard";
import { useRouter } from "next/navigation";
import { useTestCases, useDeleteTestCase } from "@/hooks/useTestCases";
import { toast } from "@/lib/use-toast";
import {
  BACK_TO_PROMPT_LABEL,
  CREATE_TEST_CASE_LABEL,
  DELETE_TEST_CASE_FAILED_TITLE,
  LOAD_TEST_CASES_ERROR_MESSAGE,
  NEW_TEST_CASE_LABEL,
  NO_TEST_CASES_DESCRIPTION,
  NO_TEST_CASES_TITLE,
  TEST_CASE_DELETED_TITLE,
  TEST_CASES_DESCRIPTION,
  TEST_CASES_TITLE,
  TRY_AGAIN_DESCRIPTION,
} from "./test-case-pages.constants";
import type { PromptTestCasesPageProps } from "./test-case-pages.types";

const TestCasesPage = ({ params }: PromptTestCasesPageProps) => {
  const { id: promptId } = params;
  const router = useRouter();
  const { data: testCases, isLoading, isError, refetch } = useTestCases(promptId);
  const deleteMutation = useDeleteTestCase(promptId);

  const handleDelete = (testCaseId: string) => {
    deleteMutation.mutate(testCaseId, {
      onSuccess: () => {
        toast({ title: TEST_CASE_DELETED_TITLE });
      },
      onError: () => {
        toast({ variant: "destructive", title: DELETE_TEST_CASE_FAILED_TITLE, description: TRY_AGAIN_DESCRIPTION });
      },
    });
  };

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={LOAD_TEST_CASES_ERROR_MESSAGE}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/prompts/${promptId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {BACK_TO_PROMPT_LABEL}
          </Link>
        </Button>
      </div>

      <PageHeader
        title={TEST_CASES_TITLE}
        description={TEST_CASES_DESCRIPTION}
        actions={
          <Button size="sm" asChild>
            <Link href={`/prompts/${promptId}/test-cases/new`}>
              <Plus className="h-4 w-4 mr-1" />
              {NEW_TEST_CASE_LABEL}
            </Link>
          </Button>
        }
      />

      {testCases && testCases.length > 0 ? (
        <div className="space-y-3 mt-6">
          {testCases.map((tc) => (
            <TestCaseCard
              key={tc.id}
              testCase={tc}
              onEdit={(tc) => router.push(`/prompts/${promptId}/test-cases/${tc.id}/edit`)}
              onDelete={() => handleDelete(tc.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[280px] rounded-lg border border-dashed border-border bg-muted/20 text-center px-6 py-10 mt-6">
          <FlaskConical className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">{NO_TEST_CASES_TITLE}</p>
          <p className="text-xs text-muted-foreground mb-4">
            {NO_TEST_CASES_DESCRIPTION}
          </p>
          <Button size="sm" asChild>
            <Link href={`/prompts/${promptId}/test-cases/new`}>
              <Plus className="h-4 w-4 mr-1" />
              {CREATE_TEST_CASE_LABEL}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestCasesPage;
