'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Zap, AlertCircle } from 'lucide-react';

interface LiveStatusProps {
  claimedSlots: number;
  remainingSlots: number;
  isSoldOut: boolean;
}

function calculateUTCTimeLeft() {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setUTCHours(24, 0, 0, 0);

  const diffMs = Math.max(0, nextReset.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return { hours, minutes, seconds, formatted };
}

export default function LiveStatusWidget({ claimedSlots, remainingSlots, isSoldOut }: LiveStatusProps) {
  const [timeLeft, setTimeLeft] = useState(calculateUTCTimeLeft());

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateUTCTimeLeft());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-3 sm:px-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-4 sm:p-6 shadow-2xl shadow-indigo-950/50">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
          {/* Left: Claimed counter */}
          <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-3 sm:gap-4 w-full md:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center xs:justify-start gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Today's Top 10 Showcase</h2>
                {isSoldOut ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> SOLD OUT
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> {remainingSlots} spots left
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                🔥 Products in Today's Top 10 get <strong className="text-amber-400">12x more website traffic, direct VC inquiries, and buyer outreach</strong>.
              </p>
            </div>
          </div>

          {/* Center: Reset Timer */}
          <div className="flex items-center justify-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 sm:py-2.5 shadow-inner w-full sm:w-auto shrink-0">
            <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
            <div className="text-xs text-slate-400 flex items-center">
              <span>Next reset in</span>
              <span className="font-mono font-bold text-sm sm:text-base text-white ml-2 tracking-wider">
                {timeLeft.formatted}
              </span>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="w-full sm:w-auto shrink-0">
            {isSoldOut ? (
              <div className="w-full px-5 py-3 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs sm:text-sm border border-slate-700 cursor-not-allowed text-center">
                Today's Top 10 is SOLD OUT
              </div>
            ) : (
              <Link
                href="/list?top10=true"
                className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                <Zap className="w-4 h-4 fill-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Claim Next Spot — $99</span>
              </Link>
            )}
          </div>
        </div>

        {/* Spot Allocation Progress Bar */}
        <div className="mt-4 sm:mt-5 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(claimedSlots / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
