import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(){const ad=await db.sponsoredAd.findFirst({where:{active:true},orderBy:{createdAt:'desc'},select:{id:true,title:true,description:true,imageUrl:true,targetUrl:true}});return NextResponse.json({ad},{headers:{'Cache-Control':'no-store'}});}
