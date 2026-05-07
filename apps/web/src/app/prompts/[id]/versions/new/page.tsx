"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { VersionForm, type VersionFormValues } from "@/components/versions/VersionForm";
import { useCreateVersion } from "@/hooks/useVersions";
import { toast } from "@/lib/use-toast";
import type { PromptIdPageProps } from "../../prompt-pages.types";

const NewVersionPage = ({ params }: PromptIdPageProps) => {
  const { id: promptId } = params;
  const router = useRouter();
  const createMutation = useCreateVersion(promptId);

  const handleSubmit = async (values: VersionFormValues) => {
    createMutation.mutate(
      {
        promptId,
        content: values.content,
        label: values.label || null,
      },
      {
        onSuccess: (version: any) => {
          toast({
            title: "Version saved",
            description: `v${version.versionNumber} was created successfully.`,
          });
          router.push(`/prompts/${promptId}/versions`);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to save version",
            description: "Please check your connection and try again.",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/prompts/${promptId}/versions`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to history
          </Link>
        </Button>
      </div>

      <PageHeader
        title="New version"
        description="Write your prompt. Variables like {{name}} will be detected automatically."
      />

      <VersionForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/prompts/${promptId}/versions`)}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};

export default NewVersionPage;
