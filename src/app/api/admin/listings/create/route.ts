import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { validateListing } from '@/lib/validation';
import { grantedCredit } from '@/lib/adminListing';
import { sendSellerEmail } from '@/lib/sellerEmail';
import { digest } from '@/lib/security';
export async function POST(req: Request) {
 const admin = await verifyAdminAuth();
 if (!admin) return NextResponse.json({error:'Unauthorized'}, {status:401});
 const expectedOrigin = new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin;
 if (req.headers.get('origin') !== expectedOrigin) return NextResponse.json({error:'Invalid origin'}, {status:403});
 try {
  const body = await req.json();
  const parsed = validateListing(body);
  if (!parsed.success) return NextResponse.json({error:'Please correct the listing fields.',details:parsed.error.flatten()}, {status:400});
  const credit = grantedCredit({premium:body.premium,creditDollars:body.creditDollars});
  if (!credit.success) return NextResponse.json({error:credit.error}, {status:400});
  const {publicMetrics,wantsTop10Addon,couponCode,...fields} = parsed.data;
  const token = randomBytes(32).toString('hex');
  const slug = fields.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + randomBytes(6).toString('hex');
  const listing = await db.$transaction(async tx => {
   const item = await tx.listing.create({data:{...fields,title:fields.title,tagline:fields.tagline,shortDescription:fields.shortDescription,fullDescription:fields.fullDescription,websiteUrl:fields.websiteUrl,logoUrl:fields.logoUrl,contactName:fields.contactName,contactEmail:fields.contactEmail,slug,category:fields.category || 'Startup',managementToken:token,managementTokenHash:digest(token),publicMetricsJson:JSON.stringify(publicMetrics || []),status:'PUBLISHED',publishedAt:new Date(),adminPromotionalCredit:credit.cents,adminCreditGrantedAt:credit.cents ? new Date():null}});
   await tx.sellerEmail.create({data:{listingId:item.id}});
   await tx.auditLog.create({data:{action:'ADMIN_CREATE_LISTING',actor:admin.email,details:JSON.stringify({listingId:item.id,premium:credit.cents>0,grantedCredit:credit.cents})}});
   return item;
  });
  await sendSellerEmail(listing.id);
  for (const path of ['/', '/search', '/codersmansion/admin/listings', '/codersmansion/admin/top-spots']) revalidatePath(path);
  return NextResponse.json({success:true,url:'/listing/'+listing.slug,managementUrl:'/manage/'+token});
 } catch { return NextResponse.json({error:'Unable to create listing. Please try again.'}, {status:500}); }
}

export const maxDuration=60;
