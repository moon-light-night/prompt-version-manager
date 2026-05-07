"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { TestCaseForm } from "@/components/testCases/TestCaseForm";
import { useCreateTestCase } from "@/hooks/useTestCases";
import { usePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import type { TestCaseFormValues } from "@/components/testCases/TestCaseForm";
import { fieldsToRecord } from "@/components/testCases/TestCaseForm.utils";
import {
  BACK_TO_TEST_CASES_LABEL,
  CREATE_TEST_CASE_FAILED_TITLE,
  NEW_TEST_CASE_TITLE,
  TEST_CASE_CREATED_TITLE,
} from "../test-case-pages.constants";
import type { PromptTestCasesPageProps } from "../test-case-pages.types";

const NewTestCasePage = ({ params }: PromptTestCasesPageProps) => {
  const { id: promptId } = params;
  const router = useRouter();
  const createMutation = useCreateTestCase(promptId);
  const { data: prompt } = usePrompt(promptId);

  const handleSubmit = (values: TestCaseFormValues) => {
    createMutation.mutate(
      {
        promptId,
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
          toast({ title: TEST_CASE_CREATED_TITLE });
          router.push(`/prompts/${promptId}/test-cases`);
        },
        onError: () => {
          toast({ variant: "destructive", title: CREATE_TEST_CASE_FAILED_TITLE });
        },
      }
    );
  };

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

      <PageHeader title={NEW_TEST_CASE_TITLE} />

      <div className="mt-6">
        <TestCaseForm
          suggestedVariables={promptVariables}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          onCancel={() => router.push(`/prompts/${promptId}/test-cases`)}
        />
      </div>
    </div>
  );
};

export default NewTestCasePage;
