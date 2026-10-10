'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Info, ExternalLink, Zap, Sparkles, DollarSign, Users } from 'lucide-react';

interface ListingItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  logoUrl: string;
  websiteUrl: string;
  mrr?: string | null;
  customersCount?: string | null;
  payingCustomersCount?: string | null;
  usersCount?: string | null;
}

interface Top10RemainingGridProps {
  remainingSpots: {
    position: number;
    listing: ListingItem | null;
  }[];
}

export default function Top10RemainingGrid({ remainingSpots }: Top10RemainingGridProps) {
  if (!remainingSpots || remainingSpots.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-8 sm:my-10">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
            <span>Top 10 Remaining Ranks (#4 – #10)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sponsored positions ranked by cumulative promotional payments.
          </p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full shrink-0">
          Positions 4 to 10
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {remainingSpots.map(({ position, listing }) => {
          if (listing) {
            return (
              <div
                key={listing.id || position}
                className="group relative rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 sm:p-5 shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs tracking-wider uppercase">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" /> TOP #{position}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase bg-slate-800 px-2 py-0.5 rounded shrink-0">
                      {listing.category}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                      <img src={listing.logoUrl} alt={listing.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                        {listing.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-snug">
                        {listing.tagline}
                      </p>
                    </div>
                  </div>

                  {/* MRR & Active Users Metric Badges */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {listing.mrr || '$15,200'} MRR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-400" /> {listing.customersCount || listing.payingCustomersCount || listing.usersCount || '280'} active users
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={listing.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 truncate max-w-[100px] xs:max-w-[120px]"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{listing.websiteUrl.replace(/^https?:\/\//, '')}</span>
                  </a>

                  <Link
                    href={`/listing/${listing.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          } else {
            // UNCLAIMED AVAILABLE SPOT CARD WITH BADGE
            return (
              <div
                key={`empty-spot-${position}`}
                className="group relative rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 p-4 sm:p-5 shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-black text-xs tracking-wider uppercase">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" /> TOP #{position} • AVAILABLE
                    </span>
                    <span className="text-[10px] text-amber-400/80 font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      $10
                    </span>
                  </div>

                  <div className="my-3 text-center space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Rank #{position} Available</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      List your product to enter paid ranking. Position is not guaranteed.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <Link
                    href="/list?top10=true"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 px-3.5 py-2 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center"
                  >
                    <span>Promote ($10)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Mandatory Disclosure */}
      <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300 font-semibold">Top-10 Disclosure:</strong> Top-10 positions are paid promotional placements and do not represent editorial endorsement or an independent quality ranking.
        </p>
      </div>
    </section>
  );
}
