'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
type Activity={visitors:number;latest:{id:string;slug:string;title:string}[]};
export default function TopTickerBanner(){
 const path=usePathname();const [data,setData]=useState<Activity|null>(null);
 const hidden=path.startsWith('/codersmansion')||path.startsWith('/manage');
 useEffect(()=>{
  if(hidden)return;let stopped=false;let busy=false;
  const refresh=async()=>{if(document.hidden||busy)return;busy=true;try{const r=await fetch('/api/activity',{method:'POST'});if(!r.ok)throw new Error();const next=await r.json();if(!stopped)setData(next);}catch{if(!stopped)setData(null);}finally{busy=false;}};
  void refresh();const interval=setInterval(refresh,30000);document.addEventListener('visibilitychange',refresh);
  return()=>{stopped=true;clearInterval(interval);document.removeEventListener('visibilitychange',refresh);};
 },[hidden]);
 if(hidden)return null;
 const items=data?.latest || [];
 return <div className="flex items-center gap-3 bg-gradient-to-r from-amber-950/70 to-indigo-950/70 border-b border-amber-500/20 px-4 py-2 text-xs">
 <span className="shrink-0 text-emerald-300" title="Estimated active browsers seen in the last 2 minutes. Shared across tabs; may include bots."><span aria-hidden="true">● </span>{data?`${data.visitors} live visitor${data.visitors===1?'':'s'} (2 min)`:'Live visitors unavailable'}</span>
 <div className="overflow-hidden flex-1 min-w-0" aria-label="Latest published listings">{items.length?<div className="animate-marquee ticker-track">{[0,1].map(copy=><div key={copy} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={copy===1?true:undefined}>{items.map(item=><Link key={item.id} tabIndex={copy===1?-1:undefined} href={`/listing/${item.slug}`} className="whitespace-nowrap text-slate-200 hover:text-amber-300">✦ Latest listed: <strong>{item.title}</strong></Link>)}</div>)}</div>:<span className="text-slate-400">Discover products from independent builders</span>}</div>
 </div>;
}
