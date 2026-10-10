'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Sparkles, Crown, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                QUANDRIFY
              </span>
              <span className="hidden xs:inline-flex px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                TOP 10
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium tracking-wide">
              Claim Your Spot. Get Seen by VCs & Buyers.
            </p>
          </div>
        </Link>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/#feed"
            className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Discover</span>
          </Link>

          {/* Dedicated "Promote your product ($10)" Button */}
          <Link
            href="/list?top10=true"
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Promote your product ($10)</span>
            <span className="sm:hidden">Top 10 ($10)</span>
          </Link>

          {/* Standard "List Your Product ($10)" Button */}
          <Link
            href="/list"
            className="relative group overflow-hidden rounded-xl p-px font-semibold text-[11px] sm:text-xs shadow-xl shadow-indigo-600/25 active:scale-95 transition-transform shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
            <span className="relative block px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-[11px] bg-slate-950 hover:bg-slate-900 transition-colors text-white flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">List Product ($10)</span>
              <span className="sm:hidden">List ($10)</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
