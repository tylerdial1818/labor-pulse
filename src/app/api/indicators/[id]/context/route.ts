import { NextResponse } from "next/server";

import { getHistoricalContext } from "@/lib/db/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await getHistoricalContext(id);

  if (!context) {
    return NextResponse.json({ error: "Historical context not found" }, { status: 404 });
  }

  return NextResponse.json(context);
}
