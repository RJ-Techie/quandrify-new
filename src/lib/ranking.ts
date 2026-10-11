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

export function mergeRankingCredits(scores: {id:string;amount:number;reachedAt:number}[], grants: {id:string;amount:number;grantedAt:number}[]) {
 const totals = new Map(scores.map(score=>[score.id,{...score}]));
 for(const grant of grants){const score=totals.get(grant.id) || {id:grant.id,amount:0,reachedAt:0};score.amount+=grant.amount;score.reachedAt=Math.max(score.reachedAt,grant.grantedAt);totals.set(grant.id,score);}
 return [...totals.values()].filter(score=>score.amount>0).sort((a,b)=>b.amount-a.amount || a.reachedAt-b.reachedAt || a.id.localeCompare(b.id));
}

export function rankingPreview(scores:{id:string;amount:number;reachedAt:number}[], id:string) {
 const index=scores.findIndex(s=>s.id===id);const currentCredit=index<0?0:scores[index].amount;
 const additional=(target:number)=>Math.ceil(Math.max(0,target+1-currentCredit)/1000)*1000;
 return {rank:index<0?null:index+1,currentCredit,additionalForNext:index===0?0:index>0?additional(scores[index-1].amount):1000,additionalForTop10:index>=0&&index<10?0:scores.length<10?1000:additional(scores[9].amount)};
}
