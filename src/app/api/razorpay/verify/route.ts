import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { configuration, fulfill } from '@/lib/razorpay';
import { validSignature } from '@/lib/security';
export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const { paymentId, token, razorpay_payment_id, razorpay_signature } = await req.json();
    const payment = await db.payment.findUnique({ where: { id: paymentId } , include: { listing: true } });
    if (!payment?.razorpayOrderId || payment.listing.managementToken !== token || typeof razorpay_payment_id !== 'string' || typeof razorpay_signature !== 'string' || !validSignature(`${payment.razorpayOrderId}|${razorpay_payment_id}`, razorpay_signature, configuration().secret))
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    await fulfill(payment.id, razorpay_payment_id);
    return NextResponse.json({ success: true, url: `/list/success?payment_id=${payment.id}&token=${encodeURIComponent(token)}` });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Confirmation pending. Your payment will be reconciled by webhook; retain your seller link.' }, { status: 409 }); }
}

export const maxDuration=60;
