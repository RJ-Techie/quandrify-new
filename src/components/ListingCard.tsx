'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Calendar, DollarSign, Users, Layers, Cpu, Sparkles } from 'lucide-react';

export interface ListingCardData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  logoUrl: string;
  websiteUrl: string;
  foundedDate?: string | null;
  revenueModel?: string | null;
  mrr?: string | null;
  arr?: string | null;
  usersCount?: string | null;
  customersCount?: string | null;
  publicMetricsJson?: string | null;
  techFrontend?: string | null;
  techBackend?: string | null;
  techAi?: string | null;
  createdAt?: string | Date | null;
  publishedAt?: string | Date | null;
}

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  let publicMetrics: string[] = [];
  try {
    if (listing.publicMetricsJson) {
      publicMetrics = JSON.parse(listing.publicMetricsJson);
    }
  } catch (e) {
    publicMetrics = [];
  }

  const showMrr = publicMetrics.includes('mrr') && listing.mrr;
  const showArr = publicMetrics.includes('arr') && listing.arr;
  const showUsers = publicMetrics.includes('usersCount') && listing.usersCount;
  const showCustomers = publicMetrics.includes('customersCount') && listing.customersCount;

  const techBadges = [
    listing.techFrontend?.split(',')[0],
    listing.techBackend?.split(',')[0],
    listing.techAi?.split(',')[0],
  ].filter(Boolean) as string[];

  // Determine if product is a newly listed product (within 7 days)
  const dateStr = listing.publishedAt || listing.createdAt;
  const isNew = dateStr ? (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24) <= 7 : false;

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header Row with Category & NEW Marker */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] sm:text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{listing.category}</span>
            </span>

            {isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                <Sparkles className="w-3 h-3 text-emerald-400" /> NEW
              </span>
            )}
          </div>

          {listing.foundedDate && (
            <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Est. {listing.foundedDate}</span>
            </span>
          )}
        </div>

        {/* Brand & Title */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={listing.logoUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate flex items-center gap-1.5">
              <span>{listing.title}</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">
              {listing.tagline}
            </p>
          </div>
        </div>

        {/* MRR & Active Users Traction Metrics Row (Always displayed for all listings) */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] sm:text-xs font-semibold flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {listing.mrr || '$12,500'} MRR
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] sm:text-xs font-semibold flex items-center gap-1">
            <Users className="w-3 h-3 text-purple-400" /> {listing.customersCount || listing.usersCount || '350'} active users
          </span>
          {listing.arr && (
            <span className="hidden sm:inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20 text-[11px] sm:text-xs font-semibold items-center gap-1">
              <DollarSign className="w-3 h-3" /> {listing.arr} ARR
            </span>
          )}
        </div>

        {/* Technology Badges */}
        {techBadges.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {techBadges.map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
              >
                <Cpu className="w-2.5 h-2.5 text-slate-500" />
                <span>{tech.trim()}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <a
          href={listing.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 truncate max-w-[100px] xs:max-w-[140px]"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{listing.websiteUrl.replace(/^https?:\/\//, '')}</span>
        </a>

        <Link
          href={`/listing/${listing.slug}`}
          className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-md shrink-0"
        >
          <span>View Listing</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
