import { db } from './db';
export async function sendSellerEmail(listingId:string) {
 try {
  const job=await db.sellerEmail.findUnique({where:{listingId},include:{listing:true}});
  if(!job || job.status==='SENT' || job.listing.status!=='PUBLISHED')return;
  if(!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.NEXT_PUBLIC_APP_URL){await db.sellerEmail.update({where:{listingId},data:{status:'FAILED',lastError:'Configure RESEND_API_KEY, EMAIL_FROM and NEXT_PUBLIC_APP_URL.'}});return;}
  const claimed=await db.sellerEmail.updateMany({where:{listingId,status:{not:'SENT'},OR:[{sendingAt:null},{sendingAt:{lt:new Date(Date.now()-600000)}}]},data:{sendingAt:new Date(),attempts:{increment:1},status:'SENDING'}});
  if(!claimed.count)return;
  try {
   const origin=new URL(process.env.NEXT_PUBLIC_APP_URL).origin;
   const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`seller-link-${listingId}`},body:JSON.stringify({from:process.env.EMAIL_FROM,to:job.listing.contactEmail,subject:`Your Quandrify listing: ${job.listing.title}`,text:`Your product is published on Quandrify.

View: ${origin}/listing/${job.listing.slug}

Private seller management link: ${origin}/manage/${job.listing.managementToken}

Save this link securely. Anyone with it can manage your listing.

Top 10 ranks cumulative promotional credit and has no expiry or reset. A position is not guaranteed.

Quandrify`})});
   if(!response.ok)throw new Error('Email provider rejected delivery. Check sender verification and API key.');
   await db.sellerEmail.update({where:{listingId},data:{status:'SENT',sentAt:new Date(),sendingAt:null,lastError:null}});
  }catch(error){await db.sellerEmail.update({where:{listingId},data:{status:'FAILED',sendingAt:null,lastError:error instanceof Error?error.message:'Email delivery failed'}});}
 }catch(error){console.error('Seller email delivery needs retry for listing',listingId);}
}
