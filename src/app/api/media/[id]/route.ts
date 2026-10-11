import { db } from '@/lib/db';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Not found',{status:404});
 const asset=await db.mediaAsset.findUnique({where:{id}});if(!asset)return new Response('Not found',{status:404});
 return new Response(new Uint8Array(asset.bytes),{headers:{'Content-Type':asset.mime,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'"}});
}
