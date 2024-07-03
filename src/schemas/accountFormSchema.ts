import { z } from "zod";

export const accountFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 letters long"),
});
