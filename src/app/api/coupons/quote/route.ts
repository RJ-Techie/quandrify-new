import { NextResponse } from 'next/server';
import { couponQuote } from '@/lib/coupons';
import { rateLimit } from '@/lib/rateLimit';
export async function POST(req:Request) {
 if (!await rateLimit('coupon-quote',60)) return NextResponse.json({error:'Too many requests'},{status:429});
 try { const { code } = await req.json(); if(typeof code !== 'string' || code.length>40) throw new Error('Invalid coupon code'); return NextResponse.json(await couponQuote(1000,code)); }
 catch { return NextResponse.json({error:'Coupon is invalid, disabled or expired.'},{status:400}); }
}
