import { test } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/lib/db';
import { fulfill } from '../src/lib/razorpay';
test('fulfillment rejects authorized-only payments and mismatched order, currency or amount', async () => {
  const originalLookup = db.payment.findUniqueOrThrow;
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RAZORPAY_KEY_ID;
  const originalSecret = process.env.RAZORPAY_KEY_SECRET;
  process.env.RAZORPAY_KEY_ID = 'rzp_test_unit'; process.env.RAZORPAY_KEY_SECRET = 'unit';
  (db.payment as any).findUniqueOrThrow = async () => ({ id: 'local', razorpayOrderId: 'order_expected', amount: 4900 });
  try {
    for (const changed of [{ status: 'authorized' }, { order_id: 'order_other' }, { currency: 'INR' }, { amount: 1 }]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ id: 'pay_test', order_id: 'order_expected', amount: 4900, currency: 'USD', status: 'captured', ...changed }), { status: 200 });
      await assert.rejects(() => fulfill('local', 'pay_test'), /not been captured or does not match/);
    }
  } finally {
    db.payment.findUniqueOrThrow = originalLookup; globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RAZORPAY_KEY_ID; else process.env.RAZORPAY_KEY_ID = originalKey;
    if (originalSecret === undefined) delete process.env.RAZORPAY_KEY_SECRET; else process.env.RAZORPAY_KEY_SECRET = originalSecret;
  }
});
