import { yoga } from "@/graphql/yoga";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return yoga.fetch(request);
}

export function POST(request: NextRequest) {
  return yoga.fetch(request);
}
