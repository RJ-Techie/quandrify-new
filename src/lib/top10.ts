import { db } from './db';
import { publicListing } from './publicListing';
export function getTodayDateString() { return new Date().toISOString().slice(0, 10); }
export function getTimeUntilReset() {
  const now = new Date(); const next = new Date(now); next.setUTCHours(24, 0, 0, 0);
  const secondsTotal = Math.floor((next.getTime() - now.getTime()) / 1000);
  const hours = Math.floor(secondsTotal / 3600); const minutes = Math.floor(secondsTotal % 3600 / 60); const seconds = secondsTotal % 60;
  return { hours, minutes, seconds, formatted: [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':') };
}
export async function getTodayTop10Pool() {
  const date = getTodayDateString();
  const all = await db.dailySpot.findMany({ where: { date }, orderBy: { position: 'asc' }, include: { listing: true } });
  return { date, claimedSlots: all.length, remainingSlots: Math.max(0, 10 - all.length), isSoldOut: all.length >= 10, spots: all.filter(s => s.listing.status === 'PUBLISHED').map(s => ({ ...s, listing: publicListing(s.listing) })) };
}
