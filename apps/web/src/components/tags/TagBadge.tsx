import { cn } from "@/lib/utils";
import type { Tag } from "@pvm/shared";

interface TagBadgeProps {
  tag: Tag;
  className?: string;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export const TagBadge = ({ tag, className, onRemove, size = "sm" }: TagBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        "bg-background border-border text-foreground",
        className,
      )}
      data-testid="tag-badge"
    >
      {tag.color && (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: tag.color }}
          aria-hidden
        />
      )}
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors p-0.5"
          aria-label={`Remove tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
