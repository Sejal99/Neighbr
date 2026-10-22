
import { z } from "zod";

export const createSocietySchema = z.object({
  name: z.string().trim().min(2).max(150),
  address: z.string().trim().min(5),
  timezone: z.string().trim().min(1).max(100).default("Asia/Kolkata"),
});

export const addSocietyMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["resident", "staff"]),
  unitNumber: z.string().trim().max(50).optional(),
});

export const updateSocietyMemberSchema = z.object({
  role: z.enum(["resident", "staff"]).optional(),
  unitNumber: z.string().trim().max(50).nullable().optional(),
}).refine(
  (data) => data.role !== undefined || data.unitNumber !== undefined,
  {
    message: "Provide at least one field to update",
  },
);

export type CreateSocietyInput = z.infer<typeof createSocietySchema>;
