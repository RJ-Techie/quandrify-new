import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imageMime, MAX_LOGO_BYTES } from '../src/lib/media';
import { rankingPreview } from '../src/lib/ranking';
import { reportSchema } from '../src/lib/reportValidation';
test('Logo validation rejects executable formats, truncation and oversized data',()=>{
 assert.equal(imageMime(new TextEncoder().encode('<svg onload="alert(1)"></svg>')),null);
 assert.equal(imageMime(new Uint8Array(2)),null);
 const png=new Uint8Array(16);png.set([137,80,78,71,13,10,26,10]);assert.equal(imageMime(png),'image/png');
 const large=new Uint8Array(MAX_LOGO_BYTES+1);large.set(png);assert.equal(imageMime(large),null);
 assert.equal(imageMime(new TextEncoder().encode('RIFF0000WEBP0000')),'image/webp');
});
test('Ranking preview accounts for ties, ten-dollar steps and discounted credit',()=>{
 const scores=[{id:'first',amount:2000,reachedAt:1},{id:'second',amount:1000,reachedAt:2}];
 assert.equal(rankingPreview(scores,'second').additionalForNext,2000);
 assert.equal(rankingPreview(scores,'first').additionalForNext,0);
 assert.equal(rankingPreview(scores,'second').rank,2);
 const full=Array.from({length:10},(_,i)=>({id:String(i),amount:1000,reachedAt:i}));
 full.push({id:'outside',amount:800,reachedAt:11});
 assert.equal(rankingPreview(full,'outside').additionalForTop10,1000);
});
test('Reports reject absent product identity, short explanations and unsupported reasons',()=>{
 const input={listingId:'11111111-1111-4111-8111-111111111111',reason:'BROKEN_LINK',details:'The website link returns an error.'};
 assert.equal(reportSchema.safeParse(input).success,true);
 for(const bad of [{...input,listingId:'bad'},{...input,reason:'PUBLISH'},{...input,details:'bad'},{...input,details:'x'.repeat(1001)}])assert.equal(reportSchema.safeParse(bad).success,false);
});
