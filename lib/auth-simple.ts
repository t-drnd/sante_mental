import { db, schema } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.BETTER_AUTH_SECRET || "dev-secret-key-change-in-prod";
const secret = new TextEncoder().encode(secretKey);

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

export async function createSession(user: AuthUser) {
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthUser;
  } catch (err) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  const result = await db
    .select()
    .from(schema.usersTable)
    .where(eq(schema.usersTable.email, email))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const user = result[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "user" | "admin",
  };
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  age?: number;
}): Promise<AuthUser> {
  const existingUsers = await db
    .select()
    .from(schema.usersTable)
    .where(eq(schema.usersTable.email, data.email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Error("Cet email est déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [newUser] = await db
    .insert(schema.usersTable)
    .values({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      age: data.age || 0,
      role: "user",
    })
    .returning();

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role as "user" | "admin",
  };
}



