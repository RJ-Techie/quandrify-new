'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, ExternalLink, ArrowRight, Sparkles, Users, DollarSign, Zap } from 'lucide-react';

interface HeroListing {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  category: string;
  logoUrl: string;
  websiteUrl: string;
  primaryCtaText?: string;
  mrr?: string | null;
  usersCount?: string | null;
  customersCount?: string | null;
  payingCustomersCount?: string | null;
  publicMetricsJson?: string;
}

interface HeroTop3Props {
  top3: {
    position: number; // 1, 2, 3
    listing: HeroListing | null;
  }[];
}

export default function HeroTop3Cards({ top3 }: HeroTop3Props) {
  const spot1 = top3.find((s) => s.position === 1)?.listing;
  const spot2 = top3.find((s) => s.position === 2)?.listing;
  const spot3 = top3.find((s) => s.position === 3)?.listing;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-6 sm:mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-black tracking-wide uppercase shadow-lg max-w-full truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span className="truncate">SPONSORED • RANKED BY PROMOTIONAL PAYMENTS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Sponsored <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400">Featured Top 10 Showcase</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Get maximum viral exposure, attract active buyers, and capture investor attention. Spot #1 gets prime hero placement across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Spot #1 - Featured Large Card (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col">
          {spot1 ? (
            <div className="relative group flex-1 rounded-3xl bg-gradient-to-b from-amber-950/40 via-dark-900 to-dark-950 border-2 border-amber-500/50 p-5 sm:p-8 shadow-2xl shadow-amber-950/40 transition-all duration-300 hover:border-amber-400 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

              {/* Badge Header */}
              <div className="flex items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25">
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 shrink-0" />
                  <span>👑 #1 PAID • VIRAL HERO</span>
                </span>
                <span className="text-[10px] sm:text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-400/10 px-2.5 sm:px-3 py-1 rounded-full border border-amber-400/20 shrink-0">
                  {spot1.category}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-3 sm:space-y-4 my-auto">
                <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-3 sm:gap-5">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl shrink-0 bg-slate-900">
                    <img
                      src={spot1.logoUrl}
                      alt={spot1.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors break-words">
                      {spot1.title}
                    </h2>
                    <p className="text-amber-200/90 text-xs sm:text-sm font-medium mt-0.5 line-clamp-2">
                      {spot1.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {spot1.shortDescription}
                </p>

                {/* Metrics pill (Always display MRR & Customers) */}
                <div className="flex flex-wrap items-center justify-center xs:justify-start gap-2 sm:gap-3 pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>{spot1.mrr || '$42,500'} MRR</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/90 border border-purple-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-300">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{spot1.customersCount || spot1.payingCustomersCount || spot1.usersCount || '340'} Active Users</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-amber-500/20 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4">
                <a
                  href={spot1.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center justify-center xs:justify-start gap-1 transition truncate max-w-full xs:max-w-[180px] sm:max-w-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{spot1.websiteUrl.replace(/^https?:\/\//, '')}</span>
                </a>

                <Link
                  href={`/listing/${spot1.slug}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all text-center"
                >
                  <span>View Listing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Spot #1 Available Card */
            <div className="relative group flex-1 rounded-3xl bg-gradient-to-b from-amber-950/20 via-slate-900 to-dark-950 border-2 border-dashed border-amber-500/50 p-6 sm:p-10 shadow-2xl flex flex-col justify-between text-center min-h-[300px]">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg">
                  <Crown className="w-4 h-4 fill-slate-950" /> 👑 #1 • CURRENTLY EMPTY
                </span>
              </div>
              <div className="my-auto space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Position #1 is currently empty</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  List your product to enter the paid ranking. Your position depends on cumulative promotional payments.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/list?top10=true"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950 animate-pulse" />
                  <span>Promote your product ($10)</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Spots #2 & #3 (5 cols on desktop, stacked vertically) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
          {/* Spot #2 */}
          {spot2 ? (
            <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900 to-dark-950 border border-slate-700/80 hover:border-slate-400 p-5 sm:p-6 shadow-xl transition-all duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-300 text-slate-950 font-black text-[11px] sm:text-xs tracking-wide">
                    🥈 #2 PAID
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {spot2.category}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                    <img src={spot2.logoUrl} alt={spot2.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {spot2.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                      {spot2.tagline}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {spot2.mrr || '$28,900'} MRR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-400" /> {spot2.customersCount || spot2.payingCustomersCount || spot2.usersCount || '520'} Active Users
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Position 2</span>
                <Link
                  href={`/listing/${spot2.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition"
                >
                  <span>View Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative group rounded-3xl bg-slate-900/40 border border-dashed border-slate-700/80 p-5 shadow-lg flex-1 flex flex-col justify-between text-center">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs">
                  🥈 #2 PAID • AVAILABLE
                </span>
                <span className="text-xs font-bold text-amber-400">$10</span>
              </div>
              <div className="my-2">
                <h4 className="text-sm font-bold text-white">Rank #2 Available</h4>
                <p className="text-xs text-slate-400">Position depends on cumulative promotional payments.</p>
              </div>
              <Link
                href="/list?top10=true"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl transition"
              >
                <span>Promote your product ($10)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Spot #3 */}
          {spot3 ? (
            <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900 to-dark-950 border border-amber-900/40 hover:border-amber-600/60 p-5 sm:p-6 shadow-xl transition-all duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-700 text-amber-100 font-black text-[11px] sm:text-xs tracking-wide">
                    🥉 #3 PAID
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {spot3.category}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-amber-800/40 shrink-0 bg-slate-900">
                    <img src={spot3.logoUrl} alt={spot3.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {spot3.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                      {spot3.tagline}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {spot3.mrr || '$19,400'} MRR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-400" /> {spot3.customersCount || spot3.payingCustomersCount || spot3.usersCount || '1,420'} Active Users
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Position 3</span>
                <Link
                  href={`/listing/${spot3.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition"
                >
                  <span>View Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative group rounded-3xl bg-slate-900/40 border border-dashed border-amber-900/40 p-5 shadow-lg flex-1 flex flex-col justify-between text-center">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/50 text-amber-200 font-bold text-xs">
                  🥉 #3 PAID • AVAILABLE
                </span>
                <span className="text-xs font-bold text-amber-400">$10</span>
              </div>
              <div className="my-2">
                <h4 className="text-sm font-bold text-white">Rank #3 Available</h4>
                <p className="text-xs text-slate-400">Position depends on cumulative promotional payments.</p>
              </div>
              <Link
                href="/list?top10=true"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl transition"
              >
                <span>Promote your product ($10)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
