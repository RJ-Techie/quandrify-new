import { db } from './db';
import { publicListing } from './publicListing';
export function getTodayDateString() { return new Date().toISOString().slice(0, 10); }
export async function getTodayTop10Pool() {
  const ranked = await db.payment.groupBy({
    by: ['listingId'],
    where: { status: 'SUCCEEDED', promotionalAmount: { gt: 0 }, listing: { status: 'PUBLISHED' } },
    _sum: { promotionalAmount: true },
    _max: { paidAt: true },
    orderBy: [{ _sum: { promotionalAmount: 'desc' } }, { _max: { paidAt: 'asc' } }, { listingId: 'asc' }],
    take: 10,
  });
  const listings = await db.listing.findMany({ where: { id: { in: ranked.map(p => p.listingId) }, status: 'PUBLISHED' } });
  const spots = ranked.flatMap(item => {
    const listing = listings.find(l => l.id === item.listingId);
    return listing ? [{ id: listing.id, listingId: listing.id, position: 0, amount: item._sum.promotionalAmount || 0, listing: publicListing(listing) }] : [];
  }).map((item, i) => ({ ...item, position: i + 1 }));
  return { date: 'Permanent', claimedSlots: spots.length, remainingSlots: Math.max(0, 10-spots.length), isSoldOut: false, spots,
    minimumToEnter: spots.length < 10 ? 1000 : (Math.floor(spots[9].amount / 1000)+1)*1000 };
}
