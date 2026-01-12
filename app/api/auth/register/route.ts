import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession } from "@/lib/auth-simple";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, age } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, mot de passe et nom requis" },
        { status: 400 }
      );
    }

    const user = await createUser({
      email,
      password,
      name,
      age: age || 0,
    });

    await createSession(user);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Une erreur est survenue" },
      { status: 500 }
    );
  }
}



