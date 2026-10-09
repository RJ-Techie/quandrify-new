import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { razorpay, configuration } from '@/lib/razorpay';
export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    configuration();
    const { paymentId, token } = await req.json();
    if (typeof paymentId !== 'string' || typeof token !== 'string') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { listing: true } });
    if (!payment || payment.listing.managementToken !== token || payment.status !== 'PENDING') return NextResponse.json({ error: 'Invalid payment' }, { status: 403 });
    // Claim initialization atomically so simultaneous requests cannot create multiple payable orders.
    const claimed = await db.payment.updateMany({ where: { id: paymentId, status: 'PENDING', razorpayOrderId: null }, data: { status: 'INITIALIZING' } });
    let orderId = payment.razorpayOrderId;
    if (claimed.count) {
      try {
        const order = await razorpay('orders', { amount: payment.amount, currency: 'USD', receipt: payment.id });
        await db.payment.update({ where: { id: paymentId }, data: { razorpayOrderId: order.id, status: 'PENDING' } });
        orderId = order.id;
      } catch (error) {
        // Uncertain provider response must be reconciled; never create a second order automatically.
        await db.payment.update({ where: { id: paymentId }, data: { status: 'RECONCILIATION_REQUIRED' } });
        throw error;
      }
    }
    if (!orderId) return NextResponse.json({ error: 'Checkout is initializing; retry shortly' }, { status: 409 });
    return NextResponse.json({ key: configuration().key, orderId, amount: payment.amount, currency: 'USD' });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Unable to initialize checkout. Contact support if this persists.' }, { status: 503 }); }
}
