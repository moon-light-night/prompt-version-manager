import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Prompt Version Manager API",
    version: "0.1.0",
    endpoints: {
      health: "/api/health",
      trpc: "/api/trpc",
      graphql: "/api/graphql",
    },
    docs: "See README for API documentation.",
  });
}
