import { Star } from "lucide-react";

interface ScoreStarsProps {
  score: number | null;
}

export const ScoreStars = ({ score }: ScoreStarsProps) => {
  if (score === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
      <span className="text-xs font-medium">{score}/5</span>
    </span>
  );
};
