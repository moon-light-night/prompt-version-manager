import Link from "next/link";
import { Archive, GitBranch, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARCHIVE_LABEL, EDIT_LABEL, NEW_VERSION_LABEL } from "./prompt-detail.constants";
import type { PromptStatus } from "@pvm/shared";

interface PromptHeaderActionsProps {
  promptId: string;
  status: PromptStatus;
  onArchiveClick: () => void;
}

export const PromptHeaderActions = ({ promptId, status, onArchiveClick }: PromptHeaderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {status === "active" && (
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/prompts/${promptId}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              {EDIT_LABEL}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onArchiveClick}
            className="text-destructive hover:bg-destructive/10"
          >
            <Archive className="h-4 w-4 mr-1" />
            {ARCHIVE_LABEL}
          </Button>
        </>
      )}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/prompts/${promptId}/versions/new`}>
          <GitBranch className="h-4 w-4 mr-1" />
          {NEW_VERSION_LABEL}
        </Link>
      </Button>
    </div>
  );
};
