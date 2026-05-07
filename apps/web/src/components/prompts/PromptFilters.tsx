"use client";

import type { ChangeEvent } from "react";
import { Search, X, Tag as TagIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setPromptsSearch,
  setPromptsStatus,
  setPromptsTagIds,
  setPromptsSort,
  resetPromptsFilter,
} from "@/store/slices/uiSlice";
import { useTags } from "@/hooks/useTags";
import type { PromptSort, PromptStatus } from "@pvm/shared";

const DEFAULT_SORT: PromptSort = "updated_desc";

const STATUS_OPTIONS: Array<{ value: PromptStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS: Array<{ value: PromptSort; label: string }> = [
  { value: "updated_desc", label: "Updated: Newest" },
  { value: "updated_asc", label: "Updated: Oldest" },
  { value: "title_asc", label: "Title: A → Z" },
  { value: "title_desc", label: "Title: Z → A" },
  { value: "created_desc", label: "Created: Newest" },
];

export const PromptFilters = () => {
  const dispatch = useAppDispatch();
  const { search, status, tagIds, sort } = useAppSelector((s) => s.ui.promptsFilter);
  const { data: tags } = useTags();

  const isFiltered = search !== "" || status !== "all" || tagIds.length > 0 || sort !== DEFAULT_SORT;

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPromptsSearch(event.target.value));
  };

  const onStatusChange = (value: string) => {
    dispatch(setPromptsStatus(value as PromptStatus | "all"));
  };

  const onSortChange = (value: string) => {
    dispatch(setPromptsSort(value as PromptSort));
  };

  const toggleTag = (tagId: string) => {
    const next = tagIds.includes(tagId)
      ? tagIds.filter((id) => id !== tagId)
      : [...tagIds, tagId];
    dispatch(setPromptsTagIds(next));
  };

  return (
    <div className="space-y-2" data-testid="prompt-filters">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search prompts…"
            value={search}
            onChange={onSearchChange}
            className="pl-8 h-9"
            aria-label="Search prompts"
            data-testid="search-input"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-36 h-9" aria-label="Filter by status" data-testid="status-select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-40 h-9" aria-label="Sort by" data-testid="sort-select">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(resetPromptsFilter())}
            className="h-9 shrink-0"
            aria-label="Clear filters"
            data-testid="clear-filters"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5" data-testid="tag-filters">
          <TagIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {tags.map((tag) => {
            const active = tagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50",
                ].join(" ")}
                aria-pressed={active}
                data-testid={`tag-filter-${tag.id}`}
              >
                {tag.color && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: tag.color }}
                  />
                )}
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
