import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import AdminListingsTable from '@/components/AdminListingsTable';

export const revalidate = 0;

export default async function AdminListingsPage({searchParams}:{searchParams:Promise<{q?:string;status?:string;category?:string;page?:string}>}) {
  const filters=await searchParams;
  const page=Math.max(1,Math.min(10000,Math.floor(Number(filters.page)||1)));
  const where:any={};
  if(filters.q)where.OR=[{title:{contains:filters.q.slice(0,150),mode:'insensitive'}},{contactEmail:{contains:filters.q.slice(0,150),mode:'insensitive'}}];
  if(['PUBLISHED','PENDING','SUSPENDED','ARCHIVED'].includes(filters.status || ''))where.status=filters.status;
  if(filters.category)where.category=filters.category.slice(0,100);
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const listings = await db.listing.findMany({
    where, skip:(page-1)*50,take:50,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Listing Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">Approve, suspend, feature, or edit published marketplace listings.</p>
        </div>
        <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          {listings.length} Listings on this page
        </span>
      </div>

      <Link href="/codersmansion/admin/listings/new" className="inline-block bg-indigo-600 rounded-lg px-5 py-3 font-bold">Add Listing</Link>
      <form className="flex flex-wrap gap-3"><input name="q" defaultValue={filters.q} placeholder="Search product or seller email" aria-label="Search listings" className="bg-slate-900 border border-slate-700 rounded-lg p-3"/><select aria-label="Listing status" name="status" defaultValue={filters.status || ''} className="bg-slate-900 border border-slate-700 rounded-lg p-3"><option value="">All statuses</option>{['PUBLISHED','PENDING','SUSPENDED','ARCHIVED'].map(s=><option key={s}>{s}</option>)}</select><input name="category" defaultValue={filters.category} placeholder="Category" aria-label="Filter category" className="bg-slate-900 border border-slate-700 rounded-lg p-3"/><button className="bg-indigo-600 px-5 rounded-lg">Filter</button></form>
      <div className="flex gap-4">{page>1&&<Link href={'?'+new URLSearchParams({...filters,page:String(page-1)}).toString()}>Previous</Link>}<span>Page {page}</span>{listings.length===50&&<Link href={'?'+new URLSearchParams({...filters,page:String(page+1)}).toString()}>Next</Link>}</div>
      <AdminListingsTable initialListings={listings} />
    </div>
  );
}
