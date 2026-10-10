'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-950 border-t border-slate-800/80 py-8 sm:py-12 mt-12 sm:mt-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">QUANDRIFY</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            The direct-listing marketplace for startups, SaaS products, and AI tools. Get noticed by VCs, angel investors, and active product buyers. Explore products in the permanent sponsored Top 10 showcase.
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            Top-10 positions are paid promotional placements and do not represent editorial endorsement or an independent quality ranking.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Marketplace</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-amber-400 transition">Paid Top 10 Showcase</Link></li>
            <li><Link href="/#feed" className="hover:text-amber-400 transition">Discover Feed</Link></li>
            <li><Link href="/list" className="hover:text-amber-400 transition">List Your Product ($10)</Link></li>
            <li><Link href="/list?top10=true" className="hover:text-amber-400 transition">Promote your product ($10)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-slate-300 transition">Terms of Service</Link></li>
            <li><Link href="/refund-policy" className="hover:text-slate-300 transition">Refund & Dispute Policy</Link></li>
            <li className="pt-3 text-[11px] text-slate-500">© {new Date().getFullYear()} Quandrify Inc. All rights reserved.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
