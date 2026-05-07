import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Prompts",
};

const PromptsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AppLayout>{children}</AppLayout>;
};

export default PromptsLayout;
