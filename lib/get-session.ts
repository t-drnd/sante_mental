import { auth } from "./auth";
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return null;
    }

    const session = await auth.api.getSession({
      headers: {
        cookie: cookieHeader,
      },
    });

    return session?.user ? session : null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting session:", error);
    }
    return null;
  }
}
