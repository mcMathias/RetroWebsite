import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

/**
 * Middleware configuration.
 * Uses the edge-safe auth config (no Prisma/Node.js crypto).
 *
 * The `authorized` callback in authConfig handles the logic:
 * - /admin/* requires ADMIN or EMPLOYEE role (checked via JWT)
 * - All other routes pass through
 */
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    // Match /admin and all sub-routes
    "/admin/:path*",
  ],
};
