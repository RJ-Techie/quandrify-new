import Link from 'next/link';
import { db } from '@/lib/db';
import { publicListing } from '@/lib/publicListing';
import { getTodayTop10Pool } from '@/lib/top10';
import { getPaginatedListings } from '@/lib/listings';
import DiscoveryHero from '@/components/DiscoveryHero';
import DiscoveryFeed from '@/components/DiscoveryFeed';
import ListingCard from '@/components/ListingCard';
import RankingRules from '@/components/RankingRules';
export const dynamic='force-dynamic';
export default async function HomePage({searchParams}:{searchParams:Promise<{category?:string;search?:string;sort?:string}>}){
 const params=await searchParams;const category=(params.category || 'All').slice(0,100);const search=(params.search || '').slice(0,150);const sort=['newest','views'].includes(params.sort || '')?params.sort!:'newest';
 const [pool,groups]=await Promise.all([getTodayTop10Pool(),db.listing.groupBy({by:['category'],where:{status:'PUBLISHED'},_count:{id:true},orderBy:{_count:{id:'desc'}}})]);
 const categories=groups.map(g=>({category:g.category,count:g._count.id}));const total=categories.reduce((sum,c)=>sum+c.count,0);const defaultView=category==='All'&&!search&&sort==='newest';
 const latest=defaultView?await db.listing.findMany({where:{status:'PUBLISHED',id:{notIn:pool.spots.map(s=>s.listingId)}},orderBy:[{publishedAt:'desc'},{id:'asc'}],take:3}):[];
 const excludeIds=defaultView?[...pool.spots.map(s=>s.listingId),...latest.map(l=>l.id)]:[];
 const feed=await getPaginatedListings({pageSize:24,category,search,sortBy:sort,excludeIds});
 return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10"><DiscoveryHero categories={categories} total={total} search={search}/>
 {latest.length>0&&<section className="space-y-4"><div className="flex justify-between items-center"><div><p className="text-xs text-emerald-300 uppercase tracking-widest">Just landed</p><h2 className="text-2xl font-bold mt-2">Fresh from the builders</h2></div><a href="#feed" className="text-sm text-indigo-300">Keep exploring ↓</a></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{latest.map(l=><ListingCard key={l.id} listing={publicListing(l)}/>)}</div></section>}
 {defaultView&&pool.spots.length>0&&<section className="rounded-2xl border border-amber-500/20 bg-slate-900/40 p-5 space-y-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-amber-300 uppercase tracking-widest">Sponsored placements</p><h2 className="text-xl font-bold mt-1">The paid Top 10</h2><p className="text-xs text-slate-500 mt-2">Ranked by promotional credit, including admin grants. Positions can change. No expiry or reset.</p></div><Link href="/list" className="text-sm text-amber-300">List your product →</Link></div><div className="flex gap-3 overflow-x-auto pb-2">{pool.spots.map(s=><Link key={s.id} href={`/listing/${s.listing.slug}`} className="min-w-[180px] flex items-center gap-3 rounded-xl p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50"><span className="text-amber-300 font-bold">#{s.position}</span><img src={s.listing.logoUrl} width={32} height={32} alt="" className="w-8 h-8 rounded-lg object-contain"/><div className="min-w-0"><p className="text-sm font-semibold truncate">{s.listing.title}</p><p className="text-xs text-slate-500">{s.listing.category}</p></div></Link>)}</div><RankingRules/></section>}
 {(feed.totalCount>0 || !defaultView || total===0)&&<DiscoveryFeed initialListings={feed.listings} totalCount={feed.totalCount} category={category} search={search} sort={sort} excludeIds={excludeIds}/>}
 </div>;
}
