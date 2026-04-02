// Feed validator placeholder
// Implementation intentionally omitted per user request
import { z } from "zod";

export const feedSchema = z.object({
  url: z.string().url()
});