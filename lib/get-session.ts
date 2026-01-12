import { getSession as getAuthSession } from "./auth-simple";

export async function getSession() {
  try {
    const user = await getAuthSession();

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (err) {
    return null;
  }
}
