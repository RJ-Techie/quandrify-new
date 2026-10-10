import { db } from './db';
import { discountFor } from './ranking';
export async function couponQuote(amount: number, code?: string) {
 if (!code?.trim()) return { amount, discount: 0, couponCode: null };
 const coupon = await db.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
 if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt <= new Date())) throw new Error('Coupon is invalid, disabled or expired.');
 const discount = discountFor(amount, coupon.type, coupon.value);
 return { amount: amount-discount, discount, couponCode: coupon.code };
}
