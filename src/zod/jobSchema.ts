import { z } from "zod";

export const jobSchema = z.object({
  url: z.string().url(),
  ms_time: z
    .string()
    .transform((arg) => (isNaN(parseInt(arg)) ? 0 : parseInt(arg))),
  data: z.string().optional(),
  key: z.string().optional(),
});
