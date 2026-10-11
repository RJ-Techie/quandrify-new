'use client';
import RankingRules from './RankingRules';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactSellerModal from './ContactSellerModal';
import {
  ExternalLink,
  Mail,
  Crown,
  Flame,
  Globe,
  DollarSign,
  Users,
  Building,
  Calendar,
  MapPin,
  Cpu,
  Share2,
  CheckCircle2,
  UserCheck,
  TrendingUp,
  ChevronLeft,
  Zap,
  CreditCard,
  Wallet,
  X,
  AlertCircle,
  Lock,
  Sparkles,
} from 'lucide-react';

interface ListingDetailProps {
  listing: any;
  top10Spot?: { position: number } | null;
  remainingTop10Spots: number;
  isTop10SoldOut: boolean;
}

export default function ListingDetailClient({
  listing,
  top10Spot = null,
  remainingTop10Spots,
  isTop10SoldOut,
}: ListingDetailProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

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
  const showMau = publicMetrics.includes('mauCount') && listing.mauCount;
  const showGrowth = publicMetrics.includes('growthRate') && listing.growthRate;

  const techPills = [
    listing.techFrontend,
    listing.techBackend,
    listing.techDatabase,
    listing.techCloud,
    listing.techAi,
    listing.techPayment,
    listing.customTech,
  ]
    .filter(Boolean)
    .flatMap((t: string) => t.split(','))
    .map((t: string) => t.trim())
    .filter(Boolean);


  const isNew = Boolean(listing.publishedAt && Date.now() - new Date(listing.publishedAt).getTime() < 7 * 86400000);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Discover Feed
      </Link>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-dark-900 to-dark-950 border border-slate-800 p-5 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col xs:flex-row items-start gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shrink-0 shadow-lg">
              <img src={listing.logoUrl} alt={listing.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {listing.category}
                </span>

                {isNew && (
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-md animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NEW LISTED</span>
                  </span>
                )}

                {top10Spot && (
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md">
                    {top10Spot.position <= 3 ? (
                      <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    ) : (
                      <Flame className="w-3.5 h-3.5 fill-slate-950" />
                    )}
                    <span>TOP #{top10Spot.position} PAID</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white break-words">{listing.title}</h1>
              <p className="text-amber-200/90 text-xs sm:text-base font-medium max-w-2xl">{listing.tagline}</p>
            </div>
          </div>

          {/* Action CTAs (Visit Website, Contact Seller, and $10 Top 10 Spot Option) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 sm:gap-3 shrink-0 w-full lg:w-auto">
            {/* Primary Visit Website CTA */}
            <a
              href={listing.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition text-center"
            >
              <span>{listing.primaryCtaText || 'Visit Website'}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>

            {/* Contact Seller Button */}
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-slate-700 transition text-center"
            >
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Contact Seller</span>
            </button>

            {/* TOP 10 SPOT OPTION ($10) NEXT TO CONTACT SELLER */}
            {top10Spot ? (
              // IF PAID PAID: Show Active Badge & Disabled Button
              <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold text-center flex items-center justify-center gap-2 cursor-not-allowed">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span>Paid Today (Spot #{top10Spot.position} Active)</span>
              </div>
            ) : isTop10SoldOut ? (
              // IF SOLD OUT PAID: Show Sold Out Button
              <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold text-center cursor-not-allowed">
                Paid Top 10 SOLD OUT (Resets Midnight)
              </div>
            ) : (
              // IF NOT PAID PAID: Show Active $10 Claim Spot Button (Re-enables every day automatically!)
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all text-center"
              >
                <Zap className="w-4 h-4 fill-slate-950 group-hover:rotate-12 transition-transform shrink-0" />
                <span>Promote your product ($10)</span>
              </button>
            )}
          </div>
        </div>

        {(showMrr || showArr || showUsers || showCustomers) && <div className="pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">{[['mrr','Monthly revenue'],['arr','Annual revenue'],['usersCount','Users'],['customersCount','Customers']].filter(([key])=>publicMetrics.includes(key) && listing[key]).map(([key,label])=><div key={key} className="p-4 bg-slate-950 rounded-xl"><p className="text-xs text-slate-400">{label}</p><strong className="block mt-1 text-lg text-indigo-300">{listing[key]}</strong><span className="text-[10px] text-slate-500">Seller reported</span></div>)}</div>}

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): About, Founder Story, Tech */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* About Section */}
          <div className="p-5 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 shadow-xl">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">About {listing.title}</h2>
            <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {listing.fullDescription}
            </div>
          </div>

          {/* Technology Stack */}
          {techPills.length > 0 && (
            <div className="p-5 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 shadow-xl">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {techPills.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Founder Story */}
          {(listing.founderStoryWhy || listing.founderStoryProblem) && (
            <div className="p-5 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 shadow-xl">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" /> Founder Story & Vision
              </h2>

              {listing.founderStoryWhy && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Why did you build it?</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{listing.founderStoryWhy}</p>
                </div>
              )}

              {listing.founderStoryProblem && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">What problem are you solving?</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{listing.founderStoryProblem}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Company Info & Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Company Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" /> Company Profile
            </h3>

            <div className="space-y-3 text-xs">
              {listing.companyName && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Company</span>
                  <span className="font-semibold text-white">{listing.companyName}</span>
                </div>
              )}

              {listing.founderName && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Founder</span>
                  <span className="font-semibold text-white">{listing.founderName}</span>
                </div>
              )}

              {listing.foundedDate && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Founded</span>
                  <span className="font-semibold text-white">{listing.foundedDate}</span>
                </div>
              )}

              {listing.country && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Location</span>
                  <span className="font-semibold text-white">{listing.city ? `${listing.city}, ` : ''}{listing.country}</span>
                </div>
              )}

              {listing.companyStage && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Stage</span>
                  <span className="font-semibold text-indigo-400">{listing.companyStage}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Contact Seller</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white">External Links</h3>
            <div className="space-y-2 text-xs">
              {listing.linkX && (
                <a href={listing.linkX} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition">
                  <span>X (Twitter)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}
              {listing.linkGitHub && (
                <a href={listing.linkGitHub} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition">
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <ContactSellerModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {isClaimModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" role="dialog" aria-modal="true" aria-label="Promotional ranking rules"><div className="max-w-lg bg-slate-900 border border-amber-500/40 p-6 rounded-2xl space-y-4"><button aria-label="Close ranking rules" onClick={()=>setIsClaimModalOpen(false)} className="float-right p-2">✕</button><h2 className="text-xl font-bold">Promote your product</h2><RankingRules/><p className="text-sm text-slate-300">To add promotional credit or apply a coupon, open your private seller management link supplied after your listing payment. You must own the listing.</p><Link href="/list" className="text-amber-300 underline">Create a new listing — $10 USD</Link></div></div>}

    </div>
  );
}
