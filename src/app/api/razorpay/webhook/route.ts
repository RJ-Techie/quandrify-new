import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fulfill, razorpay } from '@/lib/razorpay';
import { validSignature } from '@/lib/security';
export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !validSignature(raw, req.headers.get('x-razorpay-signature') || '', secret)) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  try {
    const event = JSON.parse(raw);
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const remote = event.payload?.payment?.entity;
      if (!remote?.order_id || !remote?.id) throw new Error('Missing payment entity');
      const payment = await db.payment.findUnique({ where: { razorpayOrderId: remote.order_id } });
      if (!payment) throw new Error('Unknown order; retry after order persistence');
      await fulfill(payment.id, remote.id);
    }
    if (event.event === 'refund.processed') {
      const refund = event.payload?.refund?.entity;
      if (!refund?.payment_id) throw new Error('Missing refund payment');
      const remote = await razorpay(`payments/${encodeURIComponent(refund.payment_id)}`);
      const payment = await db.payment.findUnique({ where: { razorpayPaymentId: remote.id } });
      if (!payment) throw new Error('Unknown refund payment');
      if (remote.amount_refunded > 0 && remote.amount_refunded < payment.amount) {
        const originalCredit = payment.originalPromotionalAmount;
        await db.payment.update({ where: { id: payment.id }, data: { promotionalAmount: Math.max(0, originalCredit - remote.amount_refunded) } });
      }
      if (remote.amount_refunded >= payment.amount) {
        await db.$transaction(async tx => {
          await tx.payment.update({ where: { id: payment.id }, data: { status: 'REFUNDED' } });
          await tx.dailySpot.deleteMany({ where: { paymentId: payment.id } });
          if (payment.kind === 'LISTING') await tx.listing.update({ where: { id: payment.listingId }, data: { status: 'ARCHIVED' } });
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Processing failed; retry' }, { status: 500 }); }
}

export const maxDuration=60;
