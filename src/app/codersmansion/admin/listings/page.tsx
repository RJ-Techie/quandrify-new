import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import AdminListingsTable from '@/components/AdminListingsTable';

export const revalidate = 0;

export default async function AdminListingsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const listings = await db.listing.findMany({
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
          {listings.length} Listings Total
        </span>
      </div>

      <Link href="/codersmansion/admin/listings/new" className="inline-block bg-indigo-600 rounded-lg px-5 py-3 font-bold">Add Listing</Link>
      <AdminListingsTable initialListings={listings} />
    </div>
  );
}
