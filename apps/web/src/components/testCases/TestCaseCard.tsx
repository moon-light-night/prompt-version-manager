"use client";

import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VariablePill } from "@/components/versions/VariablePill";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { PromptTestCase } from "@pvm/shared";

interface TestCaseCardProps {
  testCase: PromptTestCase;
  onEdit?: (tc: PromptTestCase) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export const TestCaseCard = ({
  testCase,
  onEdit,
  onDelete,
  isDeleting,
}: TestCaseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const varEntries = Object.entries(testCase.inputValues);
  const timeAgo = formatDistanceToNow(new Date(testCase.createdAt), { addSuffix: true });

  return (
    <>
      <div
        data-testid="test-case-card"
        className="rounded-lg border border-border bg-card p-4 space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm truncate">{testCase.name}</span>
            {testCase.status === "archived" && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Archived
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(testCase)}
                aria-label="Edit test case"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                aria-label="Delete test case"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {varEntries.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {varEntries.length} variable{varEntries.length !== 1 ? "s" : ""}
          </button>
        )}

        {expanded && (
          <div className="rounded-md bg-muted p-3 space-y-1.5" data-testid="input-values-expanded">
            {varEntries.map(([key, value]) => (
              <div key={key} className="flex items-start gap-2 text-sm">
                <VariablePill name={key} />
                <span className="text-muted-foreground">→</span>
                <span className="font-medium break-all">{value || <em className="opacity-50">empty</em>}</span>
              </div>
            ))}
          </div>
        )}

        {testCase.expectedOutput && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            Expected: {testCase.expectedOutput}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete test case"
        description={`"${testCase.name}" and all its runs will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={() => {
          onDelete?.(testCase.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
