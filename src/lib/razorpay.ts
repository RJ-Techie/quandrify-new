import { db } from './db';
import { processSuccessfulPaymentAndAllocateSpot } from './allocation';
export function configuration() {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret || (process.env.NODE_ENV === 'production' && !key.startsWith('rzp_live_')))
    throw new Error('Razorpay is not configured for this environment');
  return { key, secret };
}
export async function razorpay(path: string, body?: object) {
  const { key, secret } = configuration();
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: body ? 'POST' : 'GET', cache: 'no-store', signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error('Payment provider request failed');
  return response.json();
}
export async function fulfill(paymentId: string, providerPaymentId: string) {
  const payment = await db.payment.findUniqueOrThrow({ where: { id: paymentId } });
  const remote = await razorpay(`payments/${encodeURIComponent(providerPaymentId)}`);
  if (remote.order_id !== payment.razorpayOrderId || remote.amount !== payment.amount || remote.currency !== 'USD' || remote.status !== 'captured')
    throw new Error('Payment has not been captured or does not match the order');
  return processSuccessfulPaymentAndAllocateSpot({ paymentId, razorpayPaymentId: remote.id });
}
