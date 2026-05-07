"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { PromptForm, type PromptFormValues } from "@/components/prompts/PromptForm";
import { useCreatePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import type { Prompt } from "@pvm/shared";

const NewPromptPage = () => {
  const router = useRouter();
  const createMutation = useCreatePrompt();

  const handleSubmit = (values: PromptFormValues) => {
    createMutation.mutate(
      {
        title: values.title,
        description: values.description || null,
      },
      {
        onSuccess: (data) => {
          const prompt = data as Prompt;
          toast({
            title: "Prompt created",
            description: `"${prompt.title}" is ready. Add your first version below.`,
          });
          router.push(`/prompts/${prompt.id}`);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to create prompt",
            description: "Please check your connection and try again.",
          });
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/prompts">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to prompts
          </Link>
        </Button>
      </div>

      <PageHeader
        title="New Prompt"
        description="Create a new prompt. You can add versions and test cases after creation."
      />

      <div className="rounded-lg border border-border bg-card p-6">
        <PromptForm
          submitLabel="Create Prompt"
          isSubmitting={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/prompts")}
        />
      </div>
    </div>
  );
};

export default NewPromptPage;
