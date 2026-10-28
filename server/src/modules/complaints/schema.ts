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

export const assignComplaintSchema = z.object({
  assigned_to: z.string().uuid(),
});

export const createComplaintCommentSchema = z.object({
  comment: z.string().trim().min(1),
});