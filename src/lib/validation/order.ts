import { z } from "zod";

/**
 * Order validation schemas.
 */

export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),
  billingAddressId: z.string().optional().nullable(),
  shippingMethod: z.string().min(1, "Shipping method is required"),
  customerNote: z.string().max(500).optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PACKING",
    "READY",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  note: z.string().max(500).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
