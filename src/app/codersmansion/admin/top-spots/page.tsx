import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { getTodayTop10Pool } from '@/lib/top10';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import RankingRules from '@/components/RankingRules';
export const dynamic='force-dynamic';
export default async function Page(){if(!await verifyAdminAuth())redirect('/codersmansion/admin/login');const pool=await getTodayTop10Pool();return <div className="max-w-5xl mx-auto p-6 space-y-5"><AdminHeaderNav/><h1 className="text-2xl font-bold">Permanent paid Top 10</h1><RankingRules/><table className="w-full text-left"><thead><tr><th>Rank</th><th>Product</th><th>Cumulative promotional credit</th></tr></thead><tbody>{pool.spots.map(s=><tr key={s.id}><td className="py-3">#{s.position}</td><td>{s.listing.title}</td><td>${(s.amount/100).toFixed(2)} USD</td></tr>)}</tbody></table></div>;}
