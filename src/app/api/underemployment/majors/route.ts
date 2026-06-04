import { NextResponse } from "next/server";

import { readMajorList } from "@/lib/underemployment/queries";

export async function GET() {
  return NextResponse.json({ majors: await readMajorList() });
}
