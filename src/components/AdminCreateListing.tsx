 'use client';
import CollectionPicker from './CollectionPicker';
import ScreenshotEditor from './ScreenshotEditor';
import { useRouter } from 'next/navigation';
import { notifyListingChange } from '@/lib/listingRefresh';
import { useState } from 'react';
import LogoUpload from './LogoUpload';
import Link from 'next/link';
import { validateListing } from '@/lib/validation';
const fields = [
 ['title','Product name','text'],['tagline','Tagline','text'],['shortDescription','Short description','textarea'],['fullDescription','Full description','textarea'],['websiteUrl','Website URL','url'],['logoUrl','Public logo image URL','url'],['category','Category','text'],['contactName','Seller contact name','text'],['contactEmail','Seller email','email'],
] as const;
export default function AdminCreateListing(){
 const router=useRouter();
 const [screenshotUrls,setScreenshotUrls]=useState<string[]>([]);const [collectionKeys,setCollectionKeys]=useState<string[]>([]);
 const [logoUrl,setLogoUrl]=useState('');
 const [premium,setPremium]=useState(false);const [busy,setBusy]=useState(false);const [errors,setErrors]=useState<Record<string,string[]>>({});const [message,setMessage]=useState('');const [result,setResult]=useState<{url:string;managementUrl:string}|null>(null);
 return <form className="space-y-5 bg-slate-900 rounded-2xl border border-slate-800 p-6" onSubmit={async e=>{e.preventDefault();setMessage('');const data:Record<string,any>={...Object.fromEntries(new FormData(e.currentTarget)),screenshotUrls,collectionKeys};const parsed=validateListing(data);if(!parsed.success){setErrors(parsed.error.flatten().fieldErrors as Record<string,string[]>);return;}setErrors({});setBusy(true);try{const res=await fetch('/api/admin/listings/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,premium,creditDollars:Number(data.creditDollars || 10)})});const reply=await res.json();if(!res.ok){setErrors(reply.details?.fieldErrors || {});throw new Error(reply.error);}setResult(reply);notifyListingChange();router.refresh();setMessage('Listing published without payment. Save the private seller link below.');}catch(error){setMessage((error as Error).message);}finally{setBusy(false);}}}>
 <p className="text-sm text-slate-300">Publish directly as an admin. This creates no payment record and does not add payment revenue.</p>
 {fields.map(([name,label,type])=><label key={name} className="block text-sm font-semibold">{label} *{type==='textarea'?<textarea name={name} required maxLength={name==='fullDescription'?20000:1000} className="block w-full bg-slate-950 rounded-lg border border-slate-700 p-3 mt-2"/>:<input name={name} type={type} required value={name==='logoUrl'?logoUrl:undefined} onChange={name==='logoUrl'?e=>setLogoUrl(e.target.value):undefined} defaultValue={name==='category'?'Startup':undefined} placeholder={type==='url'?'https://example.com'+(name==='logoUrl'?'/logo.png':''):undefined} maxLength={type==='url'?2048:254} className="block w-full bg-slate-950 rounded-lg border border-slate-700 p-3 mt-2"/>}{name==='logoUrl'&&<LogoUpload onUpload={setLogoUrl}/>} {errors[name]?.map(err=><span role="alert" key={err} className="block text-rose-300 text-xs mt-1">{err}</span>)}</label>)}
 <p className="text-xs text-slate-400">Website and logo links must start with https:// or http://. Use a publicly accessible image URL for the logo.</p>
 <ScreenshotEditor value={screenshotUrls} onChange={setScreenshotUrls}/><CollectionPicker value={collectionKeys} onChange={setCollectionKeys}/><label className="flex items-center gap-3 font-bold text-amber-300"><input type="checkbox" checked={premium} onChange={e=>setPremium(e.target.checked)}/>Premium — grant promotional ranking credit</label>
 {premium&&<label className="block">Promotional credit (USD)<input name="creditDollars" type="number" defaultValue={10} min={10} max={100000} step={10} required className="block w-full bg-slate-950 border border-slate-700 rounded-lg p-3 mt-2"/></label>}
 <p className="text-sm text-slate-300">Unchecked: directory listing only, with no ranking credit. Premium credit follows the same leaderboard as customer payments: $20 ranks above $10. It does not pin a position. Credit has no expiry or reset; higher totals move ahead. Admin-granted credit is promotional credit, not a customer payment.</p>
 <p role="status" className="text-amber-300">{message}</p>
 {result?<div className="space-y-2"><Link className="block underline" href={result.url}>View published listing</Link><Link className="block underline" href={result.managementUrl}>Private seller management link — save securely</Link><Link className="block underline" href="/codersmansion/admin/listings">Back to listings</Link></div>:<button disabled={busy} className="bg-indigo-600 rounded-lg px-6 py-3 font-bold disabled:opacity-50">{busy?'Publishing...':'Publish without payment'}</button>}
 </form>;
}
