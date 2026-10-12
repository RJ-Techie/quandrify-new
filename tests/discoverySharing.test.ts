import {test} from 'node:test';
import assert from 'node:assert/strict';
import {NextRequest} from 'next/server';
import {db} from '../src/lib/db';
import {validateListing} from '../src/lib/validation';
import {collectionKeysSchema} from '../src/lib/collections';
import {GET} from '../src/app/api/share/[slug]/route';
test('Screenshot validation limits URLs, duplicates and quantity; public submissions cannot curate themselves',()=>{
 assert.equal(validateListing({screenshotUrls:['javascript:alert(1)']},true).success,false);
 assert.equal(validateListing({screenshotUrls:Array.from({length:7},(_,i)=>`https://example.com/${i}.png`)},true).success,false);
 assert.equal(validateListing({screenshotUrls:['https://example.com/a.png','https://example.com/a.png']},true).success,false);
 const parsed=validateListing({screenshotUrls:[],collectionKeys:['free-ai-tools']},true);
 assert.ok(parsed.success);assert.deepEqual(parsed.data.screenshotUrls,[]);assert.equal(parsed.data.collectionKeys,undefined);
 assert.equal(collectionKeysSchema.safeParse(['invalid']).success,false);
 assert.equal(collectionKeysSchema.safeParse(['free-ai-tools','free-ai-tools']).success,false);
 assert.equal(collectionKeysSchema.safeParse(['for-freelancers']).success,true);
});
test('Share cards reject unpublished products and render PNG with public fields only',async()=>{
 const original=db.listing.findUnique;let published=false;
 try{
 (db.listing as any).findUnique=async(args:any)=>{assert.deepEqual(args.select,{id:true,status:true,title:true,tagline:true,category:true});return {id:'test-id',status:published?'PUBLISHED':'ARCHIVED',title:'Test Product',tagline:'A useful tool',category:'SaaS'};};
 const context={params:Promise.resolve({slug:'test-product'})};
 const missing=await GET(new NextRequest('https://example.com/api/share/test-product'),context);assert.equal(missing.status,404);
 published=true;const card=await GET(new NextRequest('https://example.com/api/share/test-product?download=1'),context);
 assert.equal(card.headers.get('content-type'),'image/png');assert.ok(card.headers.get('content-disposition')?.includes('attachment'));
 const bytes=new Uint8Array(await card.arrayBuffer());assert.deepEqual([...bytes.slice(0,8)],[137,80,78,71,13,10,26,10]);assert.ok(bytes.length>1000);
 }finally{db.listing.findUnique=original;}
});
