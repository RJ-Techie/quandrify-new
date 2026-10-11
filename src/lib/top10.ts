import { db } from './db';
import { mergeRankingCredits } from './ranking';
import { publicListing } from './publicListing';
export function getTodayDateString() { return new Date().toISOString().slice(0, 10); }
export async function getTodayTop10Pool() {
  const ranked = await db.payment.groupBy({
    by: ['listingId'],
    where: { status: 'SUCCEEDED', promotionalAmount: { gt: 0 }, listing: { status: 'PUBLISHED' } },
    _sum: { promotionalAmount: true },
    _max: { paidAt: true },
    orderBy: [{ _sum: { promotionalAmount: 'desc' } }, { _max: { paidAt: 'asc' } }, { listingId: 'asc' }],
  });
  const grants = await db.listing.findMany({where:{status:'PUBLISHED',adminPromotionalCredit:{gt:0}},select:{id:true,adminPromotionalCredit:true,adminCreditGrantedAt:true}});
  const leaders=mergeRankingCredits(
    ranked.map(item=>({id:item.listingId,amount:item._sum.promotionalAmount || 0,reachedAt:item._max.paidAt?.getTime() || 0})),
    grants.map(grant=>({id:grant.id,amount:grant.adminPromotionalCredit,grantedAt:grant.adminCreditGrantedAt?.getTime() || 0})),
  ).slice(0,10);
  const listings = await db.listing.findMany({where:{id:{in:leaders.map(s=>s.id)},status:'PUBLISHED'}});
  const spots = leaders.flatMap(score=>{const listing=listings.find(l=>l.id===score.id);return listing?[{id:listing.id,listingId:listing.id,position:0,amount:score.amount,listing:publicListing(listing)}]:[];}).map((item,i)=>({...item,position:i+1}));
  return { date: 'Permanent', claimedSlots: spots.length, remainingSlots: Math.max(0, 10-spots.length), isSoldOut: false, spots,
    minimumToEnter: spots.length < 10 ? 1000 : (Math.floor(spots[9].amount / 1000)+1)*1000 };
}
