import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { db } from '../src/lib/db';
import { processSuccessfulPaymentAndAllocateSpot } from '../src/lib/allocation';
import { rankPayments } from '../src/lib/ranking';
async function run(){
 if(process.env.NODE_ENV==='production')throw new Error('Use an isolated test database, not production');
 const token=randomBytes(32).toString('hex');let listingId:string|undefined;
 try{
 const listing=await db.listing.create({data:{slug:'concurrency-'+token,title:'Concurrency test',tagline:'test',shortDescription:'test',fullDescription:'test',websiteUrl:'https://example.com',logoUrl:'https://example.com/logo.png',category:'Test',contactName:'Test',contactEmail:'test@example.com',managementToken:token}});listingId=listing.id;
 const payment=await db.payment.create({data:{listingId,amount:1000,promotionalAmount:1000,originalPromotionalAmount:1000,hasTop10Addon:true}});
 await Promise.all(Array.from({length:12},()=>processSuccessfulPaymentAndAllocateSpot({paymentId:payment.id,razorpayPaymentId:'test_'+token})));
 const captured=await db.payment.findUniqueOrThrow({where:{id:payment.id}});assert.equal(captured.status,'SUCCEEDED');assert.ok(captured.paidAt);assert.equal(await db.dailySpot.count({where:{listingId}}),0);
 const upgrade=await db.payment.create({data:{listingId,amount:1000,promotionalAmount:1000,originalPromotionalAmount:1000,kind:'PROMOTION',hasTop10Addon:true}});
 await processSuccessfulPaymentAndAllocateSpot({paymentId:upgrade.id,razorpayPaymentId:'upgrade_'+token});
 const payments=await db.payment.findMany({where:{listingId,status:'SUCCEEDED'}});assert.equal(rankPayments(payments)[0].amount,2000);
 await db.payment.update({where:{id:upgrade.id},data:{status:'REFUNDED'}});
 assert.equal(rankPayments(await db.payment.findMany({where:{listingId,status:'SUCCEEDED'}}))[0].amount,1000);
 console.log('Concurrent replay, cumulative upgrade and refund exclusion passed');
 }finally{if(listingId)await db.listing.delete({where:{id:listingId}});await db.$disconnect();}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
