import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { getTodayTop10Pool } from '@/lib/top10';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { Crown, Flame } from 'lucide-react';

export const revalidate = 0;

export default async function AdminTopSpotsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const todayPool = await getTodayTop10Pool();
  const historicalSpots = await db.dailySpot.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: { listing: true },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" /> Daily Top 10 Spot Allocations
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit daily spot allocations and verify UNIQUE(date, position) constraints.</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Today's Daily Pool ({todayPool.date})</h3>
        <p className="text-xs text-slate-400">
          Claimed: <strong className="text-amber-400">{todayPool.claimedSlots} / 10</strong> spots.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {todayPool.spots.map((s) => (
            <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-black text-amber-400"># Position {s.position}</span>
              <p className="font-bold text-white truncate">{s.listing.title}</p>
              <span className="text-[10px] text-slate-500 block">{s.listing.category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Historical Top-10 Audit Log</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Position</th>
                <th className="p-4">Product Listing</th>
                <th className="p-4">Category</th>
                <th className="p-4">Claimed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historicalSpots.map((spot) => (
                <tr key={spot.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-indigo-400">{spot.date}</td>
                  <td className="p-4 font-black text-amber-400">#{spot.position}</td>
                  <td className="p-4 font-bold text-white">{spot.listing?.title}</td>
                  <td className="p-4 text-slate-400">{spot.listing?.category}</td>
                  <td className="p-4 text-slate-500">{new Date(spot.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
