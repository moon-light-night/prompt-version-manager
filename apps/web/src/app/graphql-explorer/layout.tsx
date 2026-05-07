import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "GraphQL Explorer",
};

const GraphQLExplorerLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AppLayout>{children}</AppLayout>;
};

export default GraphQLExplorerLayout;
