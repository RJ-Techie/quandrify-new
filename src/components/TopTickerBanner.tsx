'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Crown, Zap, Flame } from 'lucide-react';

export default function TopTickerBanner() {
  const [liveVisitors, setLiveVisitors] = useState(1591);

  useEffect(() => {
    // Dynamic live visitors count starting at default 1,591 and fluctuating slightly
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const updated = prev + delta;
        return updated < 1591 ? 1591 + Math.floor(Math.random() * 4) : updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formattedVisitors = liveVisitors.toLocaleString();

  const tickerItems = [
    {
      type: 'visitors',
      content: (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>🟢 {formattedVisitors} Live Visitors Online Now</span>
        </span>
      ),
    },
    {
      type: 'top10',
      content: (
        <span className="inline-flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Claim Today's Top 10 Spot ($99) • Get 12x Viral Traffic</span>
        </span>
      ),
    },
    {
      type: 'vcs',
      content: (
        <span className="inline-flex items-center gap-1.5 text-indigo-200 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Get Noticed by VCs, Angel Investors & Active Product Buyers</span>
        </span>
      ),
    },
    {
      type: 'list',
      content: (
        <span className="inline-flex items-center gap-1.5 text-purple-200 font-bold text-xs">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Direct Product Listing Fee: $49 • Instant Lifetime Publishing</span>
        </span>
      ),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-amber-500/30 text-white text-xs h-9 sm:h-10 flex items-center select-none z-50">
      {/* Static Left Badge for Mobile & Desktop */}
      <div className="shrink-0 px-3 sm:px-4 h-full bg-slate-900/90 border-r border-slate-800 flex items-center gap-2 z-20 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span className="font-black text-[11px] sm:text-xs text-emerald-400 whitespace-nowrap">
          {formattedVisitors} Live
        </span>
      </div>

      {/* Scrolling Marquee Container */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        {/* Gradient Mask Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10" />

        <div className="flex items-center whitespace-nowrap animate-marquee">
          {/* Duplicate set twice for seamless infinite scrolling loop */}
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-6 shrink-0">
              {item.content}
              <span className="ml-6 text-slate-700 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Quick Action CTA */}
      <Link
        href="/list?top10=true"
        className="shrink-0 px-3 sm:px-4 h-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] sm:text-xs flex items-center gap-1.5 transition-all shadow-lg z-20"
      >
        <Flame className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
        <span className="hidden xs:inline">Claim Spot</span>
        <span>$99</span>
      </Link>
    </div>
  );
}
