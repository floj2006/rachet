export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyAndUseToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  let token: string | undefined;
  try {
    const body = await req.json();
    token = body.token;
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const valid = await verifyAndUseToken(token);
  return NextResponse.json({ valid });
}
