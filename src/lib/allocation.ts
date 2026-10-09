import { Prisma } from '@prisma/client';
import { db } from './db';
import { getTodayDateString } from './top10';
export async function processSuccessfulPaymentAndAllocateSpot({ paymentId, razorpayPaymentId, overrideDate }: { paymentId: string; razorpayPaymentId?: string; overrideDate?: string }) {
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      return await db.$transaction(async tx => {
        const payment = await tx.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { listing: true } });
        if (payment.status === 'SUCCEEDED') return { listing: payment.listing, payment, assignedPosition: payment.top10PositionAssigned, alreadyProcessed: true };
        if (payment.status === 'REFUNDED') throw new Error('Refunded payment');
        let assignedPosition: number | null = null;
        let date = overrideDate || getTodayDateString();
        if (payment.hasTop10Addon) {
          // A paid add-on receives the next available UTC day if today's capacity is exhausted.
          for (let day = 0; day < 366; day++) {
            await tx.dailySpotPool.upsert({ where: { date }, create: { date }, update: {} });
            const occupied = await tx.dailySpot.findMany({ where: { date }, select: { position: true } });
            assignedPosition = Array.from({ length: 10 }, (_, i) => i + 1).find(i => !occupied.some(s => s.position === i)) || null;
            if (assignedPosition) break;
            date = new Date(Date.parse(date + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10);
          }
          if (!assignedPosition) throw new Error('No available placement date');
          await tx.dailySpot.create({ data: { date, position: assignedPosition, listingId: payment.listingId, paymentId } });
          const count = await tx.dailySpot.count({ where: { date } });
          await tx.dailySpotPool.update({ where: { date }, data: { claimedSlots: count, isSoldOut: count >= 10 } });
        }
        const updatedPayment = await tx.payment.update({ where: { id: paymentId }, data: { status: 'SUCCEEDED', fulfillmentStatus: 'FULFILLED', razorpayPaymentId, top10PositionAssigned: assignedPosition, top10DateAssigned: assignedPosition ? date : null } });
        // An upgrade never revives an archived or suspended listing.
        const listing = payment.listing.status === 'PENDING' ? await tx.listing.update({ where: { id: payment.listingId }, data: { status: 'PUBLISHED', publishedAt: new Date() } }) : payment.listing;
        return { listing, payment: updatedPayment, assignedPosition, alreadyProcessed: false };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15000 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2034', 'P2002'].includes(error.code) && attempt < 11) { await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 100 * (attempt + 1))); continue; }
      throw error;
    }
  }
  throw new Error('Payment processing exhausted retries');
}
