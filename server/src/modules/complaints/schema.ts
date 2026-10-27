import { z } from "zod";

export const createComplaintSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1),
  category: z.enum([
    "plumbing",
    "electrical",
    "cleaning",
    "security",
    "lift",
    "other",
  ]),
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});