import { z } from "zod";

export const responseSchema = z.object({
  response: z.object({
    title: z.string(),
    aiResponse: z.string(),
  }),
});
