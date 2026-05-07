"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TagsPanel } from "@/components/tags/TagsPanel";
import { usePrompt, useArchivePrompt } from "@/hooks/usePrompts";
import { toast } from "@/lib/use-toast";
import { PromptHeaderActions } from "./PromptHeaderActions";
import { PromptLatestVersionSection } from "./PromptLatestVersionSection";
import { PromptMetaRow } from "./PromptMetaRow";
import { PromptQuickNavigation } from "./PromptQuickNavigation";
import {
  ARCHIVE_CONFIRM_TITLE,
  ARCHIVE_FAILED_DESCRIPTION,
  ARCHIVE_FAILED_TITLE,
  BACK_TO_PROMPTS_LABEL,
  LOAD_ERROR_MESSAGE,
  PROMPT_ARCHIVED_DESCRIPTION,
  PROMPT_ARCHIVED_TITLE,
  TAGS_TITLE,
} from "./prompt-detail.constants";
import type { PromptIdPageProps } from "./prompt-pages.types";

const PromptDetailPage = ({ params }: PromptIdPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: prompt, isLoading, isError, refetch } = usePrompt(id);
  const archiveMutation = useArchivePrompt();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleArchive = () => {
    archiveMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: PROMPT_ARCHIVED_TITLE,
          description: PROMPT_ARCHIVED_DESCRIPTION,
        });
        router.push("/prompts");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: ARCHIVE_FAILED_TITLE,
          description: ARCHIVE_FAILED_DESCRIPTION,
        });
      },
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !prompt) {
    return (
      <ErrorState
        message={LOAD_ERROR_MESSAGE}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/prompts">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {BACK_TO_PROMPTS_LABEL}
            </Link>
          </Button>
        </div>

        <PageHeader
          title={prompt.title}
          description={prompt.description ?? undefined}
          actions={
            <PromptHeaderActions
              promptId={id}
              status={prompt.status}
              onArchiveClick={() => setConfirmOpen(true)}
            />
          }
        />

        <PromptMetaRow prompt={prompt} />

        <Separator className="mb-6" />

        <PromptQuickNavigation promptId={id} testCaseCount={prompt.testCaseCount} />

        <Separator className="mb-6" />

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">{TAGS_TITLE}</h3>
          <TagsPanel promptId={id} readonly={prompt.status === "archived"} />
        </div>

        <Separator className="mb-6" />
        <PromptLatestVersionSection promptId={id} latestVersion={prompt.latestVersion} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={ARCHIVE_CONFIRM_TITLE}
        description={`"${prompt.title}" will be archived and no longer appear in the active list. You can still find it using the Archived filter.`}
        destructive
        loading={archiveMutation.isPending}
        onConfirm={handleArchive}
      />
    </>
  );
};

export default PromptDetailPage;
