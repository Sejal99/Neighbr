import { z } from "zod";

export const createFacilitySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().optional(),
});

export const updateFacilitySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().optional(),
});

export const updateFacilityAvailabilitySchema = z.object({
  is_active: z.boolean(),
});