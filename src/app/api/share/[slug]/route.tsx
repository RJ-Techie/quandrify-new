import React from 'react';
import {ImageResponse} from 'next/og';
import {db} from '@/lib/db';
export const runtime='nodejs';
export async function GET(req:Request,{params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const listing=await db.listing.findUnique({where:{slug},select:{id:true,status:true,title:true,tagline:true,category:true}});
 if(!listing||listing.status!=='PUBLISHED')return new Response('Product not found',{status:404});
 const headers:Record<string,string>={'Cache-Control':'no-store'};
 if(new URL(req.url).searchParams.get('download')==='1')headers['Content-Disposition']=`attachment; filename="quandrify-${listing.id}.png"`;
 return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',background:'#080e1c',padding:'64px',color:'#fff',fontFamily:'sans-serif',border:'12px solid #d99b26'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:26,color:'#fbbf24'}}><span>QUANDRIFY</span><span>Discover useful products</span></div><div style={{display:'flex',alignItems:'center',gap:24,marginTop:65}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',width:100,height:100,borderRadius:22,background:'#fbbf24',color:'#080e1c',fontSize:60,fontWeight:700}}>{listing.title.slice(0,1).toUpperCase()}</div><div style={{display:'flex',flexDirection:'column',gap:10}}><span style={{fontSize:22,color:'#94a3b8'}}>{listing.category.slice(0,60)}</span><span style={{fontSize:52,fontWeight:700}}>{listing.title.slice(0,75)}</span></div></div><div style={{display:'flex',fontSize:30,lineHeight:1.4,marginTop:32,color:'#cbd5e1'}}>{listing.tagline.slice(0,180)}</div><div style={{display:'flex',marginTop:'auto',fontSize:24,color:'#fbbf24'}}>Explore this product on Quandrify →</div></div>,{width:1200,height:630,headers});
}
