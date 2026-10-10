import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { CreditCard } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const payments = await db.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { listing: true },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" /> Platform Payments
          </h1>
          <p className="text-xs text-slate-400 mt-1">Transaction audit trail for $10 standard listings and $10 Top-10 add-ons.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Listing Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Top 10 Addon</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Provider / Session</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{p.listing?.title || p.listingId}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">${p.amount / 100} USD</td>
                <td className="p-4">
                  {p.hasTop10Addon ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      Paid promotional credit: ${(p.promotionalAmount / 100).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-slate-500">Listing payment</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {p.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-400">{p.razorpayOrderId || 'Not initialized'}</td>
                <td className="p-4 text-slate-400">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
