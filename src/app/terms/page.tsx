import React from 'react';
import Link from 'next/link';
import { FileText, ChevronLeft, Scale, ShieldAlert, DollarSign, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Quandrify',
  description: 'Terms of Service and platform user agreement for Quandrify.',
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase">
          <Scale className="w-4 h-4" /> Terms & Conditions
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Service</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last Updated: October 6, 2026 • Effective Date: October 6, 2026
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Quandrify ("Platform"), submitting a product listing, or purchasing promotional placements, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> 2. Listing Services & Pricing Model
          </h2>
          <p>Quandrify operates as a direct-listing marketplace for startups, SaaS tools, and AI products:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Standard Listing Fee ($10 USD):</strong> Required fee for permanent directory publishing, search indexing, and buyer inquiry proxying.</li>
            <li><strong>Promotional upgrade ($10 USD):</strong> Additional cumulative promotional credit. No position is guaranteed.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" /> 3. Top 10 Showcase Promotional Rules
          </h2>
          <p>
            Top 10 ranks published products by cumulative successful promotional payments after discounts. There is no duration or reset:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Top-10 positions are paid promotional placements and do not represent editorial endorsement, official awards, or independent quality rankings.</li>
            <li>Higher cumulative amounts rank first; ties rank by the time the total was reached. A higher-paying product can displace another immediately.</li>
            <li>Listing payments contribute promotional credit. Sellers can pay another $10 to increase their total. Coupons reduce both charges and ranking credit; refunded payments do not count.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> 4. Seller Content & Intellectual Property
          </h2>
          <p>
            Sellers warrant that they own or hold necessary rights to all logos, trademarks, text descriptions, and website links submitted to Quandrify. Prohibited content includes malware, illegal services, deceptive financial scams, pornographic material, and copyright-infringed assets. We reserve the right to remove any non-compliant listing without prior notice.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" /> 5. Limitation of Liability
          </h2>
          <p>
            Quandrify is provided "as is" without warranties of any kind. We do not guarantee specific financial returns, VC investments, or buyer sales resulting from product listings or promotional showcase placements.
          </p>
        </section>
      </div>
    </div>
  );
}
