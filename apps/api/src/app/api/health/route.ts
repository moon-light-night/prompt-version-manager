import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getPool();

  try {
    const result = await pool.query<{ now: Date }>("SELECT NOW() AS now");
    const dbTime = result.rows[0]?.now ?? null;

    return NextResponse.json(
      {
        status: "ok",
        service: "pvm-api",
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          serverTime: dbTime,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        service: "pvm-api",
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 503 },
    );
  }
}
