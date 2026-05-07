import { useState } from "react";
import type { PromptRunScore } from "@pvm/shared";

interface ScoreStarsProps {
  score: PromptRunScore | null;
  interactive?: boolean;
  onChange?: (score: PromptRunScore) => void;
  className?: string;
}

const SCORES: PromptRunScore[] = [1, 2, 3, 4, 5];

export function ScoreStars({
  score,
  interactive = false,
  onChange,
  className = "",
}: ScoreStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {SCORES.map((s) => {
        const filled = hovered !== null ? s <= hovered : score !== null && s <= score;
        return (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(s)}
            onMouseEnter={() => interactive && setHovered(s)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={[
              "text-xl leading-none transition-colors",
              interactive ? "cursor-pointer" : "cursor-default",
              filled
                ? "text-amber-400"
                : "text-muted-foreground/30",
            ].join(" ")}
            aria-label={`Score ${s}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
