import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { getTodayTop10Pool } from '@/lib/top10';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import {
  DollarSign,
  Layers,
  Flame,
  Eye,
  MousePointerClick,
  Mail,
  ShieldCheck,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const admin = await verifyAdminAuth();
  if (!admin) {
    redirect('/codersmansion/admin/login');
  }

  const todayPool = await getTodayTop10Pool();

  const [
    totalListings,
    publishedListings,
    totalPayments,
    totalViewsResult,
    totalClicksResult,
    totalMessagesCount,
  ] = await Promise.all([
    db.listing.count(),
    db.listing.count({ where: { status: 'PUBLISHED' } }),
    db.payment.findMany({ where: { status: 'SUCCEEDED' } }),
    db.listing.aggregate({ _sum: { viewCount: true } }),
    db.listing.aggregate({ _sum: { clickCount: true } }),
    db.contactMessage.count(),
  ]);

  // Calculate Revenue
  const totalRevenue = totalPayments.reduce((acc, p) => acc + p.amount, 0) / 100;
  const revenue49 = totalPayments.filter(p=>p.kind === 'LISTING').reduce((sum,p)=>sum+p.amount,0)/100;
  const revenue99 = totalPayments.filter(p=>p.kind === 'PROMOTION').reduce((sum,p)=>sum+p.amount,0)/100;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminHeaderNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-400" /> CodersMansion Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">Logged in as {admin.name} ({admin.email})</p>
        </div>
      </div>

      {/* Revenue Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-amber-950/40 to-slate-900 border border-amber-500/40 shadow-xl space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Total Platform Revenue</span>
          <span className="text-4xl font-black text-white">${totalRevenue.toLocaleString()}</span>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Listing payments: <strong>${revenue49}</strong></span>
            <span>Promotion upgrades: <strong>${revenue99}</strong></span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Paid Top 10 Occupancy</span>
          <span className="text-4xl font-black text-white">{todayPool.claimedSlots} / 10</span>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            {todayPool.isSoldOut ? (
              <span className="text-rose-400 font-bold">SOLD OUT</span>
            ) : (
              <span>{todayPool.remainingSlots} currently empty positions</span>
            )}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Published Listings</span>
          <span className="text-4xl font-black text-white">{publishedListings}</span>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Total listings in system: <strong>{totalListings}</strong>
          </p>
        </div>
      </div>

      {/* Engagement Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-indigo-400" /> Platform Views
          </span>
          <span className="text-2xl font-black text-white">{(totalViewsResult._sum.viewCount || 0).toLocaleString()}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
            <MousePointerClick className="w-4 h-4 text-emerald-400" /> Website Clicks
          </span>
          <span className="text-2xl font-black text-white">{(totalClicksResult._sum.clickCount || 0).toLocaleString()}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
            <Mail className="w-4 h-4 text-amber-400" /> Lead Inquiries
          </span>
          <span className="text-2xl font-black text-white">{totalMessagesCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
            <CreditCard className="w-4 h-4 text-purple-400" /> Total Payments
          </span>
          <span className="text-2xl font-black text-white">{totalPayments.length}</span>
        </div>
      </div>
    </div>
  );
}
