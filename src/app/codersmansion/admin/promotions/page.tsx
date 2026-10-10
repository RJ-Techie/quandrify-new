import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import AdminPromotions from '@/components/AdminPromotions';
export const dynamic='force-dynamic';
export default async function Page(){if(!await verifyAdminAuth())redirect('/codersmansion/admin/login');const [coupons,ads]=await Promise.all([db.coupon.findMany({orderBy:{createdAt:'desc'}}),db.sponsoredAd.findMany({orderBy:{createdAt:'desc'}})]);return <div className="max-w-5xl mx-auto p-6"><AdminHeaderNav/><h1 className="text-3xl font-bold mb-6">Coupons & sponsored ads</h1><AdminPromotions coupons={JSON.parse(JSON.stringify(coupons))} ads={JSON.parse(JSON.stringify(ads))}/></div>;}
