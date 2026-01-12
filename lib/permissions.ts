import { db } from "./db";
import { usersTable } from "./schema";
import { eq } from "drizzle-orm";

export type Role = "user" | "admin";

export interface UserPermissions {
  canViewOwnProfile: boolean;
  canEditOwnProfile: boolean;
  canViewAllUsers: boolean;
  canEditAllUsers: boolean;
  canDeleteUsers: boolean;
  canManageSettings: boolean;
}

export function getPermissions(role: Role): UserPermissions {
  if (role === "admin") {
    return {
      canViewOwnProfile: true,
      canEditOwnProfile: true,
      canViewAllUsers: true,
      canEditAllUsers: true,
      canDeleteUsers: true,
      canManageSettings: true,
    };
  }

  return {
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canViewAllUsers: false,
    canEditAllUsers: false,
    canDeleteUsers: false,
    canManageSettings: false,
  };
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  if (requiredRole === "admin") {
    return userRole === "admin";
  }
  return true;
}

export function canAccess(
  userRole: Role,
  resourceOwnerId: number | null,
  currentUserId: number
): boolean {
  if (userRole === "admin") {
    return true;
  }

  if (resourceOwnerId === null) {
    return false;
  }

  return resourceOwnerId === currentUserId;
}

export async function getUserRole(userId: number): Promise<Role | null> {
  const result = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0].role as Role;
}
