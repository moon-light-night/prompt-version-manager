"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { PromptForm, type PromptFormValues } from "@/components/prompts/PromptForm";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { usePrompt, useUpdatePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import type { PromptIdPageProps } from "../prompt-pages.types";

const EditPromptPage = ({ params }: PromptIdPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: prompt, isLoading, isError, refetch } = usePrompt(id);
  const updateMutation = useUpdatePrompt();

  const handleSubmit = (values: PromptFormValues) => {
    updateMutation.mutate(
      {
        id,
        title: values.title,
        description: values.description || null,
      },
      {
        onSuccess: () => {
          toast({
            title: "Changes saved",
            description: "Prompt updated successfully.",
          });
          router.push(`/prompts/${id}`);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Could not save changes. Please try again.",
          });
        },
      },
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !prompt) {
    return (
      <ErrorState
        message="Could not load prompt. It may have been deleted or the API is unavailable."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/prompts/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to prompt
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Edit Prompt"
        description={`Editing "${prompt.title}"`}
      />

      <div className="rounded-lg border border-border bg-card p-6">
        <PromptForm
          defaultValues={{
            title: prompt.title,
            description: prompt.description ?? "",
          }}
          submitLabel="Save Changes"
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/prompts/${id}`)}
        />
      </div>
    </div>
  );
};

export default EditPromptPage;
