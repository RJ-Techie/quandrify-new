export function rankPayments(payments: { listingId: string; promotionalAmount: number; paidAt: Date | null; createdAt: Date }[]) {
 const totals = new Map<string, { listingId: string; amount: number; reachedAt: number }>();
 for (const p of payments) {
  if (p.promotionalAmount <= 0) continue;
  const item = totals.get(p.listingId) || { listingId: p.listingId, amount: 0, reachedAt: 0 };
  item.amount += p.promotionalAmount;
  item.reachedAt = Math.max(item.reachedAt, (p.paidAt || p.createdAt).getTime());
  totals.set(p.listingId, item);
 }
 return [...totals.values()].sort((a,b) => b.amount-a.amount || a.reachedAt-b.reachedAt || a.listingId.localeCompare(b.listingId));
}
export function discountFor(amount: number, type: string, value: number) {
 return Math.min(amount - 100, Math.max(0, type === 'PERCENT' ? Math.floor(amount * value / 100) : value));
}
