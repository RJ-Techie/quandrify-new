import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankPayments, discountFor } from '../src/lib/ranking';
const payment=(id:string,amount:number,date:string)=>({listingId:id,promotionalAmount:amount,paidAt:new Date(date),createdAt:new Date(date)});
test('Ranking accumulates upgrades, ties use when total was reached, no calendar reset',()=>{
 const ranked=rankPayments([payment('early',1000,'2020-01-01'),payment('upgraded',1000,'2020-01-01'),payment('upgraded',1000,'2026-01-01'),payment('equal',2000,'2025-01-01')]);
 assert.deepEqual(ranked.map(r=>r.listingId),['equal','upgraded','early']);
});
test('Discounts use integer cents and retain minimum charge',()=>{assert.equal(discountFor(1000,'PERCENT',20),200);assert.equal(discountFor(1000,'FIXED',2000),900);assert.equal(discountFor(1000,'PERCENT',100),900);});
