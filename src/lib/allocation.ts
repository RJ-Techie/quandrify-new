import { Prisma } from '@prisma/client';
import { sendSellerEmail } from './sellerEmail';
import { db } from './db';
export async function processSuccessfulPaymentAndAllocateSpot({ paymentId, razorpayPaymentId, overrideDate }: { paymentId: string; razorpayPaymentId?: string; overrideDate?: string }) {
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const result = await db.$transaction(async tx => {
        const payment = await tx.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { listing: true } });
        if (payment.status === 'SUCCEEDED') return { listing: payment.listing, payment, assignedPosition: payment.top10PositionAssigned, alreadyProcessed: true };
        if (payment.status === 'REFUNDED') throw new Error('Refunded payment');
        const assignedPosition: number | null = null;
        const updatedPayment = await tx.payment.update({ where: { id: paymentId }, data: { status: 'SUCCEEDED', fulfillmentStatus: 'FULFILLED', razorpayPaymentId, top10PositionAssigned: assignedPosition, top10DateAssigned: null, paidAt: new Date() } });
        // An upgrade never revives an archived or suspended listing.
        const listing = payment.listing.status === 'PENDING' ? await tx.listing.update({ where: { id: payment.listingId }, data: { status: 'PUBLISHED', publishedAt: new Date() } }) : payment.listing;
        if(payment.kind === 'LISTING' && listing.status === 'PUBLISHED') await tx.sellerEmail.upsert({where:{listingId:listing.id},create:{listingId:listing.id},update:{}});
        return { listing, payment: updatedPayment, assignedPosition, alreadyProcessed: false };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15000 });
      if(result.payment.kind === 'LISTING') await sendSellerEmail(result.listing.id);
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2034', 'P2002'].includes(error.code) && attempt < 11) { await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 100 * (attempt + 1))); continue; }
      throw error;
    }
  }
  throw new Error('Payment processing exhausted retries');
}
