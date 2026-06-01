import { NextResponse } from "next/server";

import { getBriefing } from "@/lib/db/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const briefing = await getBriefing(Number(id));

  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  return NextResponse.json({ briefing });
}
