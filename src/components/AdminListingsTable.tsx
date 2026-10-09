'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, CheckCircle, Ban, Archive, Star, ExternalLink, Shield } from 'lucide-react';

export default function AdminListingsTable({ initialListings }: { initialListings: any[] }) {
  const [listings, setListings] = useState(initialListings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (listingId: string, action: string) => {
    setLoadingId(listingId);
    try {
      const res = await fetch('/api/admin/listings/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setListings((prev) =>
          prev.map((item) => (item.id === listingId ? data.listing : item))
        );
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (e: any) {
      alert('Error carrying out action');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
          <tr>
            <th className="p-4">Product</th>
            <th className="p-4">Category</th>
            <th className="p-4">Status</th>
            <th className="p-4">Contact Email</th>
            <th className="p-4">Views / Clicks</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {listings.map((item) => (
            <tr key={item.id} className="hover:bg-slate-800/40 transition">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={item.logoUrl} alt={item.title} className="w-9 h-9 rounded-xl object-cover bg-slate-950 border border-slate-800" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.title}</span>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-1">{item.tagline}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                  {item.category}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    item.status === 'PUBLISHED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'SUSPENDED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="p-4 text-slate-300">{item.contactEmail}</td>
              <td className="p-4 font-mono text-slate-400">
                {item.viewCount} / {item.clickCount}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/listing/${item.slug}`}
                    target="_blank"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {item.status !== 'PUBLISHED' && (
                    <button
                      disabled={loadingId === item.id}
                      onClick={() => handleAction(item.id, 'PUBLISH')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-600/30 transition"
                    >
                      Approve
                    </button>
                  )}

                  {item.status === 'PUBLISHED' && (
                    <button
                      disabled={loadingId === item.id}
                      onClick={() => handleAction(item.id, 'SUSPEND')}
                      className="px-2.5 py-1 rounded bg-rose-600/20 text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-600/30 transition"
                    >
                      Suspend
                    </button>
                  )}

                  <button
                    disabled={loadingId === item.id}
                    onClick={() => handleAction(item.id, 'TOGGLE_FEATURED')}
                    className={`p-1.5 rounded-lg border transition ${
                      item.isFeatured ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
