import { z } from "zod";

/**
 * Environment variable validation.
 *
 * This ensures the application fails fast on startup if required
 * environment variables are missing or malformed.
 *
 * Usage: import { env } from "@/config/env" anywhere in server code.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  SHIPMONDO_API_KEY: z.string().min(1),
  SHIPMONDO_API_URL: z.string().url().default("https://app.shipmondo.com/api/public/v3"),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  S3_ENDPOINT: z.string().min(1),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CDN_URL: z.string().min(1),
});

/**
 * Server-side environment variables.
 * Only use in server code (Server Components, Actions, Route Handlers).
 */
export const env = serverSchema.parse(process.env);

/**
 * Client-safe environment variables.
 * These are available in both server and client code.
 */
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
