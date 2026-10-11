import {test} from 'node:test';
import assert from 'node:assert/strict';
import {NextRequest} from 'next/server';
import {db} from '../src/lib/db';
import {POST} from '../src/app/api/activity/route';
test('Presence rejects foreign origins, reuses browser identity and returns only public ticker fields',async()=>{
 const presence=db.visitorPresence as any, listings=db.listing as any, rate=db.rateLimit as any;
 const saved={upsert:presence.upsert,deleteMany:presence.deleteMany,count:presence.count,findMany:listings.findMany,rateUpsert:rate.upsert,rateDelete:rate.deleteMany,url:process.env.NEXT_PUBLIC_APP_URL};
 let writes=0;const id='12345678-1234-4123-8123-123456789abc';
 try{
 process.env.NEXT_PUBLIC_APP_URL='https://example.com';
 presence.upsert=async(args:any)=>{writes++;assert.equal(args.where.id,id);assert.ok(args.update.lastSeen instanceof Date);};
 presence.deleteMany=async()=>({count:0});presence.count=async(args:any)=>{assert.ok(args.where.lastSeen.gte instanceof Date);return 2;};
 listings.findMany=async(args:any)=>{assert.equal(args.where.status,'PUBLISHED');assert.deepEqual(args.select,{id:true,slug:true,title:true});return [{id,slug:'demo',title:'Demo'}];};
 rate.upsert=async()=>({count:1});rate.deleteMany=async()=>({count:0});
 const bad=await POST(new NextRequest('https://example.com/api/activity',{method:'POST',headers:{origin:'https://evil.example'}}));assert.equal(bad.status,403);assert.equal(writes,0);
 const good=await POST(new NextRequest('https://example.com/api/activity',{method:'POST',headers:{origin:'https://example.com',cookie:`quandrify-visitor=${id}`}}));
 assert.equal(good.status,200);assert.equal(writes,1);assert.equal((await good.json()).visitors,2);assert.ok(good.headers.get('set-cookie')?.includes('HttpOnly'));
 }finally{Object.assign(presence,{upsert:saved.upsert,deleteMany:saved.deleteMany,count:saved.count});listings.findMany=saved.findMany;rate.upsert=saved.rateUpsert;rate.deleteMany=saved.rateDelete;if(saved.url===undefined)delete process.env.NEXT_PUBLIC_APP_URL;else process.env.NEXT_PUBLIC_APP_URL=saved.url;}
});
