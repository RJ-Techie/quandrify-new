import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { Settings, ShieldCheck, DollarSign } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" /> Platform Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">Global marketplace prices and Top-10 spot settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" /> Fixed Pricing Rules
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span>Standard Listing Fee</span>
              <strong className="text-white">$49 USD</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span>Daily Top 10 Add-on Fee</span>
              <strong className="text-amber-400">$99 USD</strong>
            </div>
            <div className="flex justify-between">
              <span>Max Top 10 Spots per Day</span>
              <strong className="text-white">10 Positions (#1 – #10)</strong>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> System Information
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span>Platform Version</span>
              <strong className="text-white">v1.0.0 Production</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span>Database Engine</span>
              <strong className="text-white">Prisma + PostgreSQL</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Gateways</span>
              <strong className="text-emerald-400">Razorpay USD</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
