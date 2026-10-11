import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { sendSellerEmail } from '@/lib/sellerEmail';
export async function POST(req:Request){const admin=await verifyAdminAuth();if(!admin)return NextResponse.json({error:'Unauthorized'},{status:401});if(req.headers.get('origin')!==new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin)return NextResponse.json({error:'Invalid origin'},{status:403});try{const {listingId}=await req.json();const listing=await db.listing.findUnique({where:{id:listingId}});if(!listing || listing.status!=='PUBLISHED')return NextResponse.json({error:'Published listing required'},{status:400});await db.sellerEmail.upsert({where:{listingId},create:{listingId},update:{}});await sendSellerEmail(listingId);const delivery=await db.sellerEmail.findUnique({where:{listingId}});await db.auditLog.create({data:{actor:admin.email,action:'RETRY_SELLER_EMAIL',details:listingId}});return NextResponse.json({success:delivery?.status==='SENT',status:delivery?.status,error:delivery?.lastError});}catch{return NextResponse.json({error:'Unable to retry email'},{status:500});}}

export const maxDuration=60;
