import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatCardProps } from "./dashboard.types";

export const DashboardStatCard = ({
  label,
  value,
  icon: Icon,
  href,
  accent = "text-primary",
  isLoading,
}: StatCardProps) => {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <div className={`rounded-lg p-2 bg-muted ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm break-all font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
      {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-3xl font-bold tabular-nums">{value ?? 0}</p>}
    </>
  );

  const className = "group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
};
