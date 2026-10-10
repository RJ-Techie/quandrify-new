import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { z } from 'zod';
const url = z.string().max(2048).url().refine(v => /^https?:\/\//.test(v), 'Use an HTTP or HTTPS URL');
const couponSchema = z.object({code:z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,40}$/),type:z.enum(['PERCENT','FIXED']),value:z.number().int().min(1).max(100000),active:z.boolean(),expiresAt:z.string().datetime().nullable()}).refine(c=>c.type !== 'PERCENT' || c.value<=100,'Percentage cannot exceed 100');
const adSchema = z.object({title:z.string().trim().min(1).max(150),description:z.string().trim().min(1).max(1000),targetUrl:url,imageUrl:z.union([url,z.literal('')]).optional(),active:z.boolean()});
export async function POST(req: Request) {
 const admin = await verifyAdminAuth(); if(!admin) return NextResponse.json({error:'Unauthorized'},{status:401});
 if(req.headers.get('origin') !== new URL(req.url).origin) return NextResponse.json({error:'Invalid origin'},{status:403});
 try {
 const body = await req.json();
 await db.$transaction(async tx => {
 if(body.action === 'toggle' && typeof body.id === 'string' && typeof body.active === 'boolean') {
  if(body.kind === 'coupon') await tx.coupon.update({where:{id:body.id},data:{active:body.active}});
  else if(body.kind === 'ad') await tx.sponsoredAd.update({where:{id:body.id},data:{active:body.active}});
  else throw new Error('Invalid kind');
 } else if(body.kind === 'coupon') {
  const data=couponSchema.parse(body.data); await tx.coupon.create({data:{...data,expiresAt:data.expiresAt ? new Date(data.expiresAt):null}});
 } else if(body.kind === 'ad') await tx.sponsoredAd.create({data:adSchema.parse(body.data)});
 else throw new Error('Invalid action');
 await tx.auditLog.create({data:{actor:admin.email,action:'ADMIN_PROMOTIONS',details:JSON.stringify({kind:body.kind,action:body.action,id:body.id})}});
 });
 return NextResponse.json({success:true});
 } catch(error) { return NextResponse.json({error:error instanceof z.ZodError ? error.issues.map(i=>i.message).join('; ') : 'Unable to save. Coupon codes must be unique.'},{status:400}); }
}
