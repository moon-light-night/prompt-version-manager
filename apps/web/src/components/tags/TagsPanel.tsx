"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "./TagBadge";
import { useTags, usePromptTags, useAttachTag, useDetachTag, useCreateTag } from "@/hooks/useTags";
import { toast } from "@/lib/use-toast";
import { DEFAULT_NEW_TAG_COLOR, TAG_ACTION_ERROR_MESSAGES } from "./TagsPanel.constants";
import type { TagsPanelProps } from "./TagsPanel.types";

export const TagsPanel = ({ promptId, readonly = false }: TagsPanelProps) => {
  const { data: allTags } = useTags();
  const { data: promptTags, isLoading } = usePromptTags(promptId);
  const attachMutation = useAttachTag(promptId);
  const detachMutation = useDetachTag(promptId);
  const createMutation = useCreateTag();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(DEFAULT_NEW_TAG_COLOR);
  const [showCreate, setShowCreate] = useState(false);

  const promptTagIds = new Set(promptTags?.map((t) => t.id) ?? []);

  const unattachedTags = allTags?.filter((t) => !promptTagIds.has(t.id)) ?? [];

  const showErrorToast = (title: string) => {
    toast({ variant: "destructive", title });
  };

  const handleAttach = (tagId: string) => {
    attachMutation.mutate(
      { tagId },
      {
        onError: () => showErrorToast(TAG_ACTION_ERROR_MESSAGES.attach),
      },
    );
  };

  const handleDetach = (tagId: string) => {
    detachMutation.mutate(
      { tagId },
      {
        onError: () => showErrorToast(TAG_ACTION_ERROR_MESSAGES.detach),
      },
    );
  };

  const handleCreate = () => {
    const name = newTagName.trim();
    if (!name) return;
    createMutation.mutate(
      { name, color: newTagColor },
      {
        onSuccess: (tag: { id: string }) => {
          setNewTagName("");
          setShowCreate(false);
          handleAttach(tag.id);
        },
        onError: () => showErrorToast(TAG_ACTION_ERROR_MESSAGES.create),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading tags…
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="tags-panel">
      <div className="flex flex-wrap gap-1.5">
        {promptTags && promptTags.length > 0 ? (
          promptTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={readonly ? undefined : () => handleDetach(tag.id)}
            />
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No tags yet.</span>
        )}
      </div>

      {!readonly && (
        <>
          {unattachedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center">Add:</span>
              {unattachedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleAttach(tag.id)}
                  disabled={attachMutation.isPending}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  data-testid={`attach-tag-${tag.id}`}
                >
                  {tag.color && (
                    <span className="h-2 w-2 rounded-full" style={{ background: tag.color }} />
                  )}
                  + {tag.name}
                </button>
              ))}
            </div>
          )}

          {showCreate ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name…"
                className="h-8 text-sm w-36"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="h-8 w-8 rounded border border-border cursor-pointer"
                title="Tag color"
              />
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={handleCreate}
                disabled={createMutation.isPending || !newTagName.trim()}
              >
                {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowCreate(true)}
              data-testid="create-new-tag-btn"
            >
              <Plus className="h-3 w-3 mr-1" />
              Create new tag
            </Button>
          )}
        </>
      )}
    </div>
  );
};
