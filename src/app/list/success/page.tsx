import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Crown, Flame, CheckCircle2, ArrowRight, Shield, ExternalLink } from 'lucide-react';

export const revalidate = 0;

interface SuccessPageProps {
  searchParams: Promise<{
    payment_id?: string;
    token?: string;
    position?: string;
  }>;
}

export default async function ListSuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedsearchParams = await searchParams;
  const { payment_id, token, position } = resolvedsearchParams;

  const paid = payment_id && token ? await db.payment.findFirst({ where: { id: payment_id, status: 'SUCCEEDED', listing: { managementToken: token } }, include: { listing: true } }) : null;
  if (!paid) return <div className="p-16 text-center">Payment confirmation pending or invalid link. Check your seller management page.</div>;
  const listing = paid.listing;
  const assignedPosition = paid.top10PositionAssigned;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Banner Badge */}
      {assignedPosition ? (
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-lg tracking-wide shadow-xl shadow-amber-500/30 animate-bounce">
          {assignedPosition <= 3 ? (
            <><Crown className="w-6 h-6 fill-slate-950" /> 👑 You're #{assignedPosition} on {paid.top10DateAssigned}!</>
          ) : (
            <><Flame className="w-6 h-6 fill-slate-950" /> 🔥 You're #{assignedPosition} on {paid.top10DateAssigned}!</>
          )}
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
          <CheckCircle2 className="w-5 h-5" /> Your Listing Is Now Live!
        </div>
      )}

      <div>
        <h1 className="text-4xl font-black text-white">Payment Confirmed</h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto mt-2">
          Thank you! Your product listing has been verified and published to the Quandrify marketplace.
        </p>
      </div>

      {listing && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
              <img src={listing.logoUrl} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{listing.title}</h3>
              <p className="text-slate-400 text-xs mt-1">{listing.tagline}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {listing.category}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" /> Secure Seller Management Link
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bookmark this secret URL. Use it anytime to update your product details or view analytics.
                </p>
              </div>
              <Link
                href={`/manage/${listing.managementToken}`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition shrink-0"
              >
                Manage Listing
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        {listing && (
          <Link
            href={`/listing/${listing.slug}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition"
          >
            <span>View Public Listing</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl transition"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
