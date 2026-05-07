"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { TestCaseForm, recordToFields } from "@/components/testCases/TestCaseForm";
import { useTestCase, useUpdateTestCase } from "@/hooks/useTestCases";
import { usePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import type { TestCaseFormValues } from "@/components/testCases/TestCaseForm";
import { fieldsToRecord } from "@/components/testCases/TestCaseForm.utils";
import {
  BACK_TO_TEST_CASES_LABEL,
  LOAD_TEST_CASE_ERROR_MESSAGE,
  TEST_CASE_UPDATED_TITLE,
  TRY_AGAIN_DESCRIPTION,
  UPDATE_TEST_CASE_FAILED_TITLE,
} from "../../test-case-pages.constants";
import type { PromptTestCasePageProps } from "../../test-case-pages.types";

const EditTestCasePage = ({ params }: PromptTestCasePageProps) => {
  const { id: promptId, tcId } = params;
  const router = useRouter();
  const { data: testCase, isLoading, isError, refetch } = useTestCase(tcId);
  const updateMutation = useUpdateTestCase(promptId);
  const { data: prompt } = usePrompt(promptId);

  const handleSubmit = (values: TestCaseFormValues) => {
    updateMutation.mutate(
      {
        id: tcId,
        name: values.name,
        inputValues: fieldsToRecord(
          values.inputValues
            .filter((item) => item.key.trim())
            .map((item) => ({ key: item.key.trim(), value: item.value })),
        ),
        expectedOutput: values.expectedOutput || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: TEST_CASE_UPDATED_TITLE });
          router.push(`/prompts/${promptId}/test-cases`);
        },
        onError: () => {
          toast({ variant: "destructive", title: UPDATE_TEST_CASE_FAILED_TITLE, description: TRY_AGAIN_DESCRIPTION });
        },
      }
    );
  };

  if (isLoading) return <LoadingState />;

  if (isError || !testCase) {
    return (
      <ErrorState
        message={LOAD_TEST_CASE_ERROR_MESSAGE}
        onRetry={() => refetch()}
      />
    );
  }

  const promptVariables = prompt?.latestVersion?.variables ?? [];

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

      <PageHeader title={`Edit: ${testCase.name}`} />

      <div className="mt-6">
        <TestCaseForm
          suggestedVariables={promptVariables}
          defaultValues={{
            name: testCase.name,
            inputValues: recordToFields(testCase.inputValues),
            expectedOutput: testCase.expectedOutput ?? "",
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save changes"
          onCancel={() => router.push(`/prompts/${promptId}/test-cases`)}
        />
      </div>
    </div>
  );
};

export default EditTestCasePage;
