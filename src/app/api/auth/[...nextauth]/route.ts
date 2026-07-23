import { handlers } from "@/lib/auth";

/**
 * Auth.js route handler.
 * Handles GET (CSRF, session) and POST (sign-in, sign-out, callback).
 */
export const { GET, POST } = handlers;
