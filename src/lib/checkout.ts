'use client';
type Result = { razorpay_payment_id: string; razorpay_signature: string };
let scriptPromise: Promise<void> | undefined;
export async function startCheckout(paymentId: string, token: string) {
  sessionStorage.setItem('quandrifySellerLink', `/manage/${token}`);
  const response = await fetch('/api/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId, token }) });
  const order = await response.json();
  if (!response.ok) throw new Error(order.error);
  if (!(window as any).Razorpay) {
    scriptPromise ||= new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(); script.onerror = () => { scriptPromise = undefined; reject(new Error('Unable to load payment checkout')); }; document.head.appendChild(script);
    });
    await scriptPromise;
  }
  await new Promise<void>((resolve, reject) => {
    const checkout = new (window as any).Razorpay({ key: order.key, order_id: order.orderId, amount: order.amount, currency: 'USD', name: 'Quandrify',
      handler: async (result: Result) => {
        try {
          const response = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...result, paymentId, token }) });
          const data = await response.json(); if (!response.ok) throw new Error(data.error);
          window.location.assign(data.url); resolve();
        } catch (error) { reject(error); }
      }, modal: { ondismiss: () => reject(new Error('Checkout closed. Your seller link is saved in this browser; you can retry from seller management.')) }
    });
    checkout.on('payment.failed', () => reject(new Error('Payment failed. Please try again.'))); checkout.open();
  });
}
