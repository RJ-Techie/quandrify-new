import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { couponQuote } from '@/lib/coupons';
export async function POST(req: Request) {
 if (!await rateLimit('promotion',30)) return NextResponse.json({error:'Too many requests'}, {status:429});
 try {
  const { token, couponCode } = await req.json();
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({error:'Valid seller token required'},{status:403});
  const listing = await db.listing.findUnique({where:{managementToken:token}});
  if (!listing || listing.status !== 'PUBLISHED') return NextResponse.json({error:'Published listing required'},{status:400});
  if (couponCode !== undefined && (typeof couponCode !== 'string' || couponCode.length > 40)) return NextResponse.json({error:'Invalid coupon'},{status:400});
  const quote = await couponQuote(1000,couponCode);
  const payment = await db.payment.create({data:{listingId:listing.id,amount:quote.amount,promotionalAmount:quote.amount,originalPromotionalAmount:quote.amount,kind:'PROMOTION',couponCode:quote.couponCode,discountAmount:quote.discount,currency:'usd',hasTop10Addon:true}});
  return NextResponse.json({success:true,paymentId:payment.id,amount:quote.amount/100});
 } catch(error) { return NextResponse.json({error: error instanceof Error && error.message.startsWith('Coupon') ? error.message : 'Unable to create promotion payment'}, {status:400}); }
}
