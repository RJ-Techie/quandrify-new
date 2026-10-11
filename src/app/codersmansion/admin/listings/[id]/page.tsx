import { notFound,redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/adminAuth';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import AdminEditListing from '@/components/AdminEditListing';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){if(!await verifyAdminAuth())redirect('/codersmansion/admin/login');const {id}=await params;const listing=await db.listing.findUnique({where:{id},include:{sellerEmail:true}});if(!listing)notFound();return <div className="max-w-4xl mx-auto p-6 space-y-5"><AdminHeaderNav/><h1 className="text-3xl font-bold">Edit {listing.title}</h1><AdminEditListing listing={JSON.parse(JSON.stringify(listing))}/></div>;}
