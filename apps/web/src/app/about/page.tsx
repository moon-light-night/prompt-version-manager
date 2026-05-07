import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "About | Prompt Version Manager",
};

const stack: [string, string][] = [
  ["Frontend", "Next.js 14, React, TypeScript, shadcn/ui, Tailwind CSS"],
  ["State", "Redux Toolkit (UI), TanStack Query (server state)"],
  ["Backend", "Next.js 14, tRPC (mutations), GraphQL Yoga (queries)"],
  ["Database", "PostgreSQL 16, raw SQL migrations via dbmate"],
  ["Testing", "Vitest, React Testing Library, MSW"],
  ["Infra", "Docker Compose, Nginx, Turborepo"],
];

const AboutPage = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl">
        <PageHeader
          title="About"
          description="Prompt Version Manager — a portfolio project demonstrating a production-grade fullstack TypeScript application."
        />
        <dl className="mt-2 space-y-3 text-sm">
          {stack.map(([label, value]) => (
            <div key={label} className="flex gap-4 py-3 border-b border-border last:border-0">
              <dt className="w-28 shrink-0 font-medium text-foreground">{label}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
