import { redirect } from "next/navigation";
import { getSession } from "./get-session";
import { hasRole, type Role } from "./permissions";
import { getSession as getAuthSession } from "./auth-simple";

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(requiredRole: Role) {
  const session = await requireAuth();
  const authUser = await getAuthSession();
  
  if (!authUser) {
    redirect("/login");
  }
  
  const userRole = authUser.role;
  if (!hasRole(userRole, requiredRole)) {
    redirect("/home");
  }
  
  return { session, role: userRole, userId: authUser.id };
}

export async function requireResourceAccess(
  resourceOwnerId: number | null,
  currentUserId: number
) {
  const session = await requireAuth();
  const authUser = await getAuthSession();
  
  if (!authUser) {
    redirect("/login");
  }

  const userRole = authUser.role;

  if (userRole === "admin") {
    return { session, role: userRole };
  }

  if (resourceOwnerId !== currentUserId) {
    redirect("/home");
  }

  return { session, role: userRole };
}

