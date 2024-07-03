import { z } from "zod";

export const todoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["new", "in progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  desc: z.string().optional(),
});
