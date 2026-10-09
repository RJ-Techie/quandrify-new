import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { RotateCcw, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRefundsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-rose-400" /> Refunds & Dispute Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage payment refunds and Razorpay refunds and disputes.</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Refunds and disputes are managed in Razorpay</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Open your Razorpay dashboard to review refund requests and disputes. This page does not synchronize disputes. Successful full refunds are synchronized by the signed refund webhook.
        </p>
      </div>
    </div>
  );
}
