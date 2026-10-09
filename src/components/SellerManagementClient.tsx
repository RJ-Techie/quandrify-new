'use client';
import { startCheckout } from '@/lib/checkout';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Eye,
  MousePointerClick,
  Mail,
  Flame,
  Crown,
  Zap,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  EyeOff,
  CreditCard,
  Wallet,
} from 'lucide-react';

interface ManageClientProps {
  pendingPaymentId?: string;
  initialListing: any;
  token: string;
  todaySpotPosition?: number | null;
  remainingTop10Spots: number;
  isTop10SoldOut: boolean;
}

export default function SellerManagementClient({
  pendingPaymentId,
  initialListing,
  token,
  todaySpotPosition = null,
  remainingTop10Spots,
  isTop10SoldOut,
}: ManageClientProps) {
  const router = useRouter();
  const [listing, setListing] = useState(initialListing);
  const [activeSpotPos, setActiveSpotPos] = useState<number | null>(todaySpotPosition);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const upgradeProvider = 'stripe' as string;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  let publicMetrics: string[] = [];
  try {
    if (listing.publicMetricsJson) {
      publicMetrics = JSON.parse(listing.publicMetricsJson);
    }
  } catch (e) {
    publicMetrics = [];
  }

  const [formData, setFormData] = useState({
    title: listing.title || '',
    tagline: listing.tagline || '',
    shortDescription: listing.shortDescription || '',
    fullDescription: listing.fullDescription || '',
    websiteUrl: listing.websiteUrl || '',
    logoUrl: listing.logoUrl || '',
    primaryCtaText: listing.primaryCtaText || 'Visit Website',
    category: listing.category || 'SaaS',
    companyName: listing.companyName || '',
    founderName: listing.founderName || '',
    foundedDate: listing.foundedDate || '',
    country: listing.country || '',
    city: listing.city || '',
    teamSize: listing.teamSize || '',
    companyStage: listing.companyStage || '',
    mrr: listing.mrr || '',
    arr: listing.arr || '',
    usersCount: listing.usersCount || '',
    customersCount: listing.customersCount || '',
    publicMetrics,
    techFrontend: listing.techFrontend || '',
    techBackend: listing.techBackend || '',
    techDatabase: listing.techDatabase || '',
    techAi: listing.techAi || '',
    linkX: listing.linkX || '',
    linkGitHub: listing.linkGitHub || '',
    linkLinkedIn: listing.linkLinkedIn || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePublicMetric = (metricKey: string) => {
    setFormData((prev) => {
      const exists = prev.publicMetrics.includes(metricKey);
      const updated = exists
        ? prev.publicMetrics.filter((k) => k !== metricKey)
        : [...prev.publicMetrics, metricKey];
      return { ...prev, publicMetrics: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/manage/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update listing');
      }

      setListing(data.listing);
      setMessage({ type: 'success', text: 'Listing changes saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClaimTop10Upgrade = async () => {
    setIsUpgrading(true);
    setMessage(null);

    try {
      // 1. Create $99 Upgrade Payment Order
      const res = await fetch('/api/listings/upgrade-top10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, provider: upgradeProvider }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create upgrade order');
      }

      // 2. Open secure checkout
      await startCheckout(data.paymentId, token);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error processing upgrade' });
      setIsUpgrading(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive/remove this listing from Quandrify?')) return;

    try {
      const res = await fetch(`/api/manage/${token}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Listing has been archived.');
        router.push('/');
      }
    } catch (err: any) {
      alert('Error archiving listing.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 space-y-8">
      {pendingPaymentId && <div className="p-4 border border-amber-500 rounded-xl">
        <p>Checkout incomplete. Save this seller URL before paying.</p>
        <button disabled={isUpgrading} onClick={async () => {
          setIsUpgrading(true);
          try { await startCheckout(pendingPaymentId, token); }
          catch (error: any) { setMessage({ type: 'error', text: error.message }); }
          finally { setIsUpgrading(false); }
        }}>Resume secure checkout</button>
      </div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-2">
            <Shield className="w-3.5 h-3.5" /> SECURE SELLER MANAGEMENT PORTAL
          </div>
          <h1 className="text-3xl font-black text-white">Manage Listing: {listing.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Status: <strong className="text-emerald-400 uppercase">{listing.status}</strong></p>
        </div>

        <Link
          href={`/listing/${listing.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shrink-0"
        >
          <span>View Live Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* TOP 10 UPGRADE WIDGET ($99 Upgrade Flow) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-xl font-extrabold text-white">Daily Top 10 Showcase Placement</h3>
            </div>

            {activeSpotPos ? (
              <p className="text-sm text-amber-300 font-bold flex items-center gap-1.5 mt-2">
                {activeSpotPos <= 3 ? <Crown className="w-5 h-5 text-amber-400 fill-amber-400" /> : <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />}
                <span>You hold Spot #{activeSpotPos} in Today's Top 10 Showcase!</span>
              </p>
            ) : (
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-1">
                Your product is currently listed in the general directory. Claim today's next available Top 10 spot for <strong className="text-amber-400">$99</strong> to appear prominently on the homepage hero showcase!
              </p>
            )}
          </div>

          {!activeSpotPos && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              $99 ADD-ON
            </span>
          )}
        </div>

        {!activeSpotPos && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Payment selector for upgrade */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Pay with Razorpay:</span>
                
                
              </div>

              {/* Upgrade CTA */}
              {isTop10SoldOut ? (
                <div className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700">
                  Today's Top 10 is SOLD OUT (Resets at Midnight)
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isUpgrading}
                  onClick={handleClaimTop10Upgrade}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUpgrading ? (
                    <span>Processing Upgrade...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Claim Top 10 Spot ($99)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Availability: <strong className="text-amber-400">{remainingTop10Spots} of 10 spots available</strong> today.
            </p>
          </div>
        )}
      </div>

      {/* Seller Analytics Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
            <Eye className="w-4 h-4 text-indigo-400" /> Total Views
          </span>
          <span className="text-2xl font-black text-white">{listing.viewCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
            <MousePointerClick className="w-4 h-4 text-emerald-400" /> Website Clicks
          </span>
          <span className="text-2xl font-black text-white">{listing.clickCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
            <Mail className="w-4 h-4 text-amber-400" /> Lead Messages
          </span>
          <span className="text-2xl font-black text-white">{listing.contactCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-orange-400" /> Top-10 Views
          </span>
          <span className="text-2xl font-black text-white">{listing.top10Impressions}</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black text-white">Edit Listing Profile</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Product Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Description</label>
            <textarea
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          {/* Public Metrics Toggles */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Public vs Private Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">MRR ({formData.mrr || 'N/A'})</span>
                <button
                  type="button"
                  onClick={() => togglePublicMetric('mrr')}
                  className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1 ${
                    formData.publicMetrics.includes('mrr') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {formData.publicMetrics.includes('mrr') ? <><Eye className="w-3 h-3" /> Public</> : <><EyeOff className="w-3 h-3" /> Private</>}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Users ({formData.usersCount || 'N/A'})</span>
                <button
                  type="button"
                  onClick={() => togglePublicMetric('usersCount')}
                  className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1 ${
                    formData.publicMetrics.includes('usersCount') ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {formData.publicMetrics.includes('usersCount') ? <><Eye className="w-3 h-3" /> Public</> : <><EyeOff className="w-3 h-3" /> Private</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleArchive}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" /> Archive Listing
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
