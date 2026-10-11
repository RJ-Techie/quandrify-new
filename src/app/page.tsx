import { db } from '@/lib/db';
import { publicListing } from '@/lib/publicListing';
import { getTodayTop10Pool } from '@/lib/top10';
import { getPaginatedListings } from '@/lib/listings';
import DiscoveryHero from '@/components/DiscoveryHero';
import HeroTop3Cards from '@/components/HeroTop3Cards';
import Top10RemainingGrid from '@/components/Top10RemainingGrid';
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
 const positions=Array.from({length:10},(_,i)=>({position:i+1,listing:pool.spots.find(s=>s.position===i+1)?.listing || null}));
 return <div className="pb-10">
 {defaultView&&<><HeroTop3Cards top3={positions.slice(0,3)}/><Top10RemainingGrid remainingSpots={positions.slice(3)}/><div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-8"><RankingRules/></div></>}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10"><DiscoveryHero categories={categories} total={total} search={search}/>
 {latest.length>0&&<section className="space-y-4"><div className="flex justify-between items-center"><div><p className="text-xs text-emerald-300 uppercase tracking-widest">Just landed</p><h2 className="text-2xl font-bold mt-2">Fresh from the builders</h2></div><a href="#feed" className="text-sm text-indigo-300">Keep exploring ↓</a></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{latest.map(l=><ListingCard key={l.id} listing={publicListing(l)}/>)}</div></section>}
 {(feed.totalCount>0 || !defaultView || total===0)&&<DiscoveryFeed initialListings={feed.listings} totalCount={feed.totalCount} category={category} search={search} sort={sort} excludeIds={excludeIds}/>}
 </div></div>;
}
