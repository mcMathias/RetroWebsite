import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

/**
 * Server-side auth helpers.
 *
 * Use these in Server Components, Server Actions, and Route Handlers
 * to get the current user and enforce authorization.
 */

/**
 * Get the current authenticated session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication. Redirects to login if not authenticated.
 * Use in Server Components for protected pages.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Require admin or employee role. Redirects if not authorized.
 * Use in Server Components for admin pages.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "EMPLOYEE") {
    redirect("/");
  }
  return user;
}

/**
 * Require a specific role. Throws if not authorized.
 * Use in Server Actions where redirect is not appropriate.
 */
export async function requireRole(...roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  if (!roles.includes(user.role)) {
    throw new ForbiddenError();
  }
  return user;
}

/**
 * Check if the current user has admin access.
 * Non-throwing version for conditional rendering.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "EMPLOYEE";
}
