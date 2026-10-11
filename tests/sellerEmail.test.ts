import { test } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/lib/db';
import { sendSellerEmail } from '../src/lib/sellerEmail';
test('Seller email uses a private link, stable provider key and safe failure state',async()=>{
 const delegate=db.sellerEmail as any;
 const originals={findUnique:delegate.findUnique,updateMany:delegate.updateMany,update:delegate.update,fetch:globalThis.fetch};
 const env={key:process.env.RESEND_API_KEY,from:process.env.EMAIL_FROM,url:process.env.NEXT_PUBLIC_APP_URL};
 let status='PENDING';let calls=0;
 try{
 process.env.RESEND_API_KEY='test-placeholder';process.env.EMAIL_FROM='Quandrify <hello@example.com>';process.env.NEXT_PUBLIC_APP_URL='https://example.com';
 delegate.findUnique=async()=>({status,listing:{status:'PUBLISHED',title:'Test product',slug:'test-product',contactEmail:'seller@example.com',managementToken:'private-token'}});
 delegate.updateMany=async()=>({count:1});delegate.update=async({data}:any)=>{status=data.status;return data;};
 globalThis.fetch=(async(_url:any,options:any)=>{calls++;const body=JSON.parse(options.body);assert.equal(body.to,'seller@example.com');assert.ok(body.text.includes('https://example.com/manage/private-token'));assert.equal(options.headers['Idempotency-Key'],'seller-link-test-id');return new Response('{}',{status:200});}) as any;
 await sendSellerEmail('test-id');assert.equal(status,'SENT');await sendSellerEmail('test-id');assert.equal(calls,1);
 status='PENDING';globalThis.fetch=(async()=>new Response('{}',{status:500})) as any;
 await sendSellerEmail('test-id');assert.equal(status,'FAILED');
 }finally{Object.assign(delegate,{findUnique:originals.findUnique,updateMany:originals.updateMany,update:originals.update});globalThis.fetch=originals.fetch;if(env.key===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=env.key;if(env.from===undefined)delete process.env.EMAIL_FROM;else process.env.EMAIL_FROM=env.from;if(env.url===undefined)delete process.env.NEXT_PUBLIC_APP_URL;else process.env.NEXT_PUBLIC_APP_URL=env.url;}
});
