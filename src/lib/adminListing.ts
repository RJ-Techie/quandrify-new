import { z } from 'zod';
export const adminCreditSchema = z.object({ premium: z.boolean(), creditDollars: z.number().int().min(10).max(100000).multipleOf(10) });
export function grantedCredit(input: unknown) {
 const parsed = adminCreditSchema.safeParse(input);
 return parsed.success ? { success: true as const, cents: parsed.data.premium ? parsed.data.creditDollars * 100 : 0 } : { success: false as const, error: 'Premium credit must be $10 or more, in $10 increments (maximum $100,000).' };
}
