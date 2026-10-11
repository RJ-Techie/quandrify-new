import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { imageMime, MAX_LOGO_BYTES } from '@/lib/media';
export async function POST(req: Request) {
 const origin = new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin;
 if(req.headers.get('origin')!==origin)return NextResponse.json({error:'Invalid origin'},{status:403});
 if(!await rateLimit('logo-upload',20))return NextResponse.json({error:'Upload limit reached. Please retry later.'},{status:429});
 try {
  // Raw image body: stream with a strict limit, including requests without Content-Length.
  const reader=req.body?.getReader();if(!reader)throw new Error('No image');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>MAX_LOGO_BYTES){await reader.cancel();return NextResponse.json({error:'Logo must be at most 256 KB.'},{status:413});}chunks.push(value);}
  const bytes=Buffer.concat(chunks);const mime=imageMime(bytes);
  if(!mime)return NextResponse.json({error:'Choose a PNG, JPEG or WebP image. SVG and other files are not supported.'},{status:400});
  const asset=await db.$transaction(async tx=>{
   await tx.$executeRaw`SELECT pg_advisory_xact_lock(7412091)`;
   const count=await tx.mediaAsset.count();const daily=await tx.mediaAsset.count({where:{createdAt:{gte:new Date(Date.now()-86400000)}}});
   if(count>=1000 || daily>=100)throw new Error('Upload capacity reached. Use a public logo URL or contact support.');
   return tx.mediaAsset.create({data:{mime,bytes}});
  });
  return NextResponse.json({url:`${origin}/api/media/${asset.id}`});
 }catch(error){return NextResponse.json({error:error instanceof Error && error.message.startsWith('Upload capacity')?error.message:'Unable to upload logo. Try again or use an image URL.'},{status:503});}
}
