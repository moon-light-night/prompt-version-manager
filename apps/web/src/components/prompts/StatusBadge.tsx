import { Badge } from "@/components/ui/badge";
import type { PromptStatus } from "@pvm/shared";

interface StatusBadgeProps {
  status: PromptStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant={status === "active" ? "success" : "secondary"}>
      {status}
    </Badge>
  );
};
