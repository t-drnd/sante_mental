import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth-simple";

export async function POST(request: NextRequest) {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}



