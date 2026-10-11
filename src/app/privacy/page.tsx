import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronLeft, Lock, Eye, FileText, Mail } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Quandrify',
  description: 'Privacy Policy and data protection policy for Quandrify marketplace.',
};

export default function PrivacyPolicyPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-extrabold uppercase">
          <ShieldCheck className="w-4 h-4" /> Legal & Data Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last Updated: October 6, 2026 • Effective Date: October 6, 2026
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> 1. Information We Collect
          </h2>
          <p>
            Quandrify ("we", "our", or "us") respects your privacy. We collect only the information necessary to operate our direct-listing marketplace, publish seller products, and facilitate buyer inquiries.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Listing Data:</strong> Product name, tagline, description, website URL, logo image, category, technology stack, and public financial metrics provided by sellers.</li>
            <li><strong>Contact Information:</strong> Contact name, verified email address, and optional phone number submitted during product creation or buyer inquiry forms.</li>
            <li><strong>Payment & Transaction Tokens:</strong> Payment processor transaction tokens generated via Razorpay. <em>We do not collect or store full credit card numbers or banking passwords.</em></li>
            <li><strong>Live visitor estimate:</strong> A random browser cookie lasts one day and helps count browsers active in the last two minutes. It is shared across tabs and is not linked to seller accounts. Expired presence records are removed during subsequent activity requests. Hashed IP-based counters limit requests.</li>
            <li><strong>Analytics & Technical Data:</strong> Aggregated page views, click counts, browser user agent strings, and IP addresses for security auditing.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" /> 2. How We Use Information
          </h2>
          <p>We use the collected information for the following specific purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>To publish your product listing and showcase it to VCs, angel investors, and tech buyers.</li>
            <li>To process standard listing fees ($10) and optional Top 10 promotional spot fees ($10).</li>
            <li>To issue private seller management access tokens via email.</li>
            <li>To proxy contact messages from interested buyers directly to verified seller emails without exposing raw emails to web scrapers.</li>
            <li>To detect, prevent, and mitigate fraudulent listings or security threats.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> 3. Data Sharing & Third Parties
          </h2>
          <p>
            We do not sell, rent, or trade personal seller data to third-party marketers. We share data only with essential infrastructure providers:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Payment Processors:</strong> Razorpay for secure order checkout and payment processing.</li>
            <li><strong>Hosting & Database Infrastructure:</strong> Secure cloud servers and database engines for data storage.</li>
            <li><strong>Legal Compliance:</strong> When required by valid legal subpoenas, regulatory investigations, or court orders.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" /> 4. Cookies & Public Financial Metrics
          </h2>
          <p>
            Sellers have granular control over public metrics (such as MRR, ARR, and active users) during submission. Metrics toggled as "Keep Private" are kept hidden from public visitors and displayed only in encrypted form. We use essential session cookies strictly for authentication and admin security.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-400" /> 5. Data Rights & Contact Us
          </h2>
          <p>
            You have the right to request deletion or modification of your published listing at any time using your private management token or by contacting support.
          </p>
          <p className="text-slate-400">
            For privacy inquiries, contact us at: <a href="mailto:support@quandrify.com" className="text-indigo-400 underline font-bold">support@quandrify.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
