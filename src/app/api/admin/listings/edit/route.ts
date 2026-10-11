import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { validateListing } from '@/lib/validation';
import { grantedCredit } from '@/lib/adminListing';
import { db } from '@/lib/db';
export async function POST(req:Request){
 const admin=await verifyAdminAuth();if(!admin)return NextResponse.json({error:'Unauthorized'},{status:401});
 if(req.headers.get('origin')!==new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin)return NextResponse.json({error:'Invalid origin'},{status:403});
 try{const body=await req.json();const parsed=validateListing(body.fields);const credit=grantedCredit({premium:body.premium,creditDollars:body.creditDollars});
 if(!parsed.success)return NextResponse.json({error:'Correct the listing fields.',details:parsed.error.flatten()},{status:400});
 if(!credit.success)return NextResponse.json({error:credit.error},{status:400});
 if(typeof body.id!=='string' || !['PUBLISHED','SUSPENDED','ARCHIVED'].includes(body.status))return NextResponse.json({error:'Invalid listing or status'},{status:400});
 const updated=await db.$transaction(async tx=>{
  const old=await tx.listing.findUniqueOrThrow({where:{id:body.id}});
  if(old.status==='PENDING')throw new Error('Unpaid listings cannot be published by editing. Use admin Add Listing for a manual listing.');
  const {publicMetrics,wantsTop10Addon,couponCode,...fields}=parsed.data;
  const item=await tx.listing.update({where:{id:body.id},data:{...fields,publicMetricsJson:JSON.stringify(publicMetrics || []),status:body.status,adminPromotionalCredit:credit.cents,adminCreditGrantedAt:credit.cents===old.adminPromotionalCredit?old.adminCreditGrantedAt:credit.cents?new Date():null}});
  if(old.contactEmail!==item.contactEmail)await tx.sellerEmail.deleteMany({where:{listingId:item.id}});
  await tx.auditLog.create({data:{actor:admin.email,action:'ADMIN_EDIT_LISTING',details:JSON.stringify({listingId:item.id,oldCredit:old.adminPromotionalCredit,newCredit:credit.cents,status:item.status,contactChanged:old.contactEmail!==item.contactEmail})}});return item;
 });
 for(const path of ['/', '/search','/codersmansion/admin/listings',`/listing/${updated.slug}`])revalidatePath(path);
 return NextResponse.json({success:true});
 }catch(error){return NextResponse.json({error:error instanceof Error&&error.message.startsWith('Unpaid')?error.message:'Unable to save listing'},{status:400});}
}
