import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { BarChart3, Eye, MousePointerClick, TrendingUp } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const topListingsByViews = await db.listing.findMany({
    take: 10,
    orderBy: { viewCount: 'desc' },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" /> Platform Analytics & Traffic
          </h1>
          <p className="text-xs text-slate-400 mt-1">Aggregated marketplace views, clicks, and Top-10 impressions.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Top 10 Most Viewed Listings</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Listing Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Views</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">CTR %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topListingsByViews.map((item) => {
                const ctr = item.viewCount > 0 ? ((item.clickCount / item.viewCount) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{item.title}</td>
                    <td className="p-4 text-slate-400">{item.category}</td>
                    <td className="p-4 font-mono font-bold text-indigo-400">{item.viewCount}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">{item.clickCount}</td>
                    <td className="p-4 font-mono text-amber-400 font-bold">{ctr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
