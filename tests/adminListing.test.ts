import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grantedCredit } from '../src/lib/adminListing';
test('Unchecked premium cannot grant submitted credit',()=>{assert.deepEqual(grantedCredit({premium:false,creditDollars:100}),{success:true,cents:0});});
test('Premium credit validates dollars and grants integer cents',()=>{assert.deepEqual(grantedCredit({premium:true,creditDollars:20}),{success:true,cents:2000});for(const value of [-10,0,15,10.5,100001,'20'])assert.equal(grantedCredit({premium:true,creditDollars:value}).success,false);assert.equal(grantedCredit({premium:'true',creditDollars:20}).success,false);});

import { mergeRankingCredits } from '../src/lib/ranking';
test('Admin premium is displaced by higher paid credit; upgrades combine and ties use time reached',()=>{
 const grants=[{id:'manual',amount:1000,grantedAt:1}];
 assert.deepEqual(mergeRankingCredits([{id:'customer',amount:2000,reachedAt:2}],grants).map(s=>s.id),['customer','manual']);
 const combined=mergeRankingCredits([{id:'manual',amount:1000,reachedAt:3},{id:'customer',amount:2000,reachedAt:2}],grants);
 assert.equal(combined.find(s=>s.id==='manual')?.amount,2000);
 assert.deepEqual(combined.map(s=>s.id),['customer','manual']);
});
