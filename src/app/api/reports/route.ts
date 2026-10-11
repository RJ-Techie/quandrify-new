import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { reportSchema } from '@/lib/reportValidation';
export async function POST(req:Request){if(!await rateLimit('product-report',15))return NextResponse.json({error:'Too many reports. Try later.'},{status:429});try{const parsed=reportSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues.map(i=>i.message).join('; ')},{status:400});const listing=await db.listing.findUnique({where:{id:parsed.data.listingId},select:{status:true}});if(listing?.status!=='PUBLISHED')return NextResponse.json({error:'Listing not found'},{status:404});await db.listingReport.create({data:parsed.data});return NextResponse.json({success:true});}catch{return NextResponse.json({error:'Unable to submit report'},{status:500});}}
