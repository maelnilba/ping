import { z } from "zod";

export const pingSchema = z.object({
  url: z.string().url(),
  ms_time: z
    .string()
    .transform((arg) => (isNaN(parseInt(arg)) ? 0 : parseInt(arg))),
  data: z.string().optional(),
  key: z.string().optional(),
  id: z.string().optional(),
});

export const pingDeleteSchema = z.object({
  id: z.string(),
  key: z.string().optional(),
});
