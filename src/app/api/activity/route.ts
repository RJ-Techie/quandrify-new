import { NextRequest, NextResponse } from 'next/server';
import { randomUUID, createHash } from 'node:crypto';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
export async function POST(req: NextRequest) {
 const origin = req.headers.get('origin');
 if (!origin || origin !== new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin) return NextResponse.json({error:'Invalid origin'},{status:403});
 const ip = createHash('sha256').update(req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown').digest('hex');
 if (!await rateLimit('presence:'+ip,120)) return NextResponse.json({error:'Try again later'},{status:429});
 const existing=req.cookies.get('quandrify-visitor')?.value;
 const visitorId=existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)?existing:randomUUID();
 const now=new Date();
 await db.visitorPresence.upsert({where:{id:visitorId},create:{id:visitorId,lastSeen:now},update:{lastSeen:now}});
 await db.visitorPresence.deleteMany({where:{lastSeen:{lt:new Date(now.getTime()-120000)}}});
 const [visitors,latest]=await Promise.all([
  db.visitorPresence.count({where:{lastSeen:{gte:new Date(now.getTime()-120000)}}}),
  db.listing.findMany({where:{status:'PUBLISHED'},orderBy:[{publishedAt:'desc'},{id:'asc'}],take:6,select:{id:true,slug:true,title:true}})
 ]);
 const response=NextResponse.json({visitors,latest},{headers:{'Cache-Control':'no-store'}});
 response.cookies.set('quandrify-visitor',visitorId,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:86400});
 return response;
}
