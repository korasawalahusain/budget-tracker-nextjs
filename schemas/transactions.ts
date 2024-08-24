import { z } from "zod";

export const createTransactionSchema = z.object({
  category: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  amount: z.coerce.number().positive().multipleOf(0.01),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
