import { z } from "zod";

/**
 * Authentication & user validation schemas.
 */

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
});

export const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
  name: z.string().min(2, "Name is required").max(100),
  company: z.string().max(100).optional().nullable(),
  street: z.string().min(2, "Street is required").max(200),
  street2: z.string().max(200).optional().nullable(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().max(100).optional().nullable(),
  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .max(20),
  country: z.string().default("DK"),
  phone: z.string().max(20).optional().nullable(),
  isDefault: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
