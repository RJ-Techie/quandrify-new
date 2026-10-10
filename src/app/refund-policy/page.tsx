import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Refund & Dispute Policy | Quandrify",
  description: "Refund and Dispute Policy for Quandrify listing fees and promotional placements.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quandrify
          </Link>
          <div className="text-xs text-slate-400 font-mono">Effective Date: October 6, 2026</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
          <ShieldCheck className="w-3.5 h-3.5" /> Merchant Legal Compliance & Billing Transparency
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Refund & Dispute Policy
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed border-b border-slate-800 pb-8">
          This Refund & Dispute Policy outlines the conditions under which refunds, order cancellations, and payment dispute resolutions are processed for purchases made on Quandrify (operated by Coders Mansion).
        </p>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">1</span>
              Nature of Services Provided
            </h2>
            <p className="mb-3">
              Quandrify provides digital advertising, startup showcase directory listings, and permanent promotional ranking credit. All fees collected on our platform are for digital service execution:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li>
                <strong className="text-slate-200">Standard Listing Fee ($10 / one-time):</strong> Immediate processing, database indexing, search inclusion, and permanent listing hosting on Quandrify.
              </li>
              <li>
                <strong className="text-slate-200">Top 10 Promotional Showcase Placement ($10 / upgrade):</strong> Adds the actual paid amount to cumulative promotional credit. Ranking has no expiry or reset, and no position or traffic is guaranteed.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">2</span>
              General Non-Refundable Policy
            </h2>
            <p className="mb-3">
              Because our digital promotion, listing generation, and rank indexing commence immediately upon payment capture via our secure processors (Razorpay), <strong className="text-white font-medium">all sales are generally final and non-refundable</strong> once a listing or promotional placement is activated.
            </p>
            <p className="text-slate-400">
              By completing your transaction, you acknowledge that digital listing service rendering begins instantaneously.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">3</span>
              Eligible Exceptions for Refund
            </h2>
            <p className="mb-4">
              We strive for complete transparency and fairness. A full or partial refund will be granted under the following explicit conditions:
            </p>
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                <h3 className="font-semibold text-white mb-1">A. Duplicate / Accidental Billing</h3>
                <p className="text-slate-400 text-sm">
                  If technical failure or double-clicking results in multiple charges for the same single listing upgrade or product submit, we will immediately refund the duplicate charge(s) in full.
                </p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                <h3 className="font-semibold text-white mb-1">B. System Outage or Non-Delivery</h3>
                <p className="text-slate-400 text-sm">
                  If a server outage or critical system defect prevents publication or prevents captured promotional credit from being applied, contact support for correction or refund review. Displacement by a higher-paying product is part of the ranking rules and does not indicate a service failure.
                </p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                <h3 className="font-semibold text-white mb-1">C. Listing Rejection Prior to Indexing</h3>
                <p className="text-slate-400 text-sm">
                  If a submission is rejected by our moderation team prior to publication due to content guidelines (e.g. invalid URL or unauthorized category), a 100% refund will be processed back to your original payment method.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">4</span>
              How to Request a Refund
            </h2>
            <p className="mb-4">
              To request a refund under an eligible condition, please contact our dedicated billing support within <strong className="text-white font-medium">7 calendar days</strong> of the transaction date:
            </p>
            <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-4 sm:p-5 flex items-start gap-4">
              <Mail className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-semibold text-white">Billing Support Contact</p>
                <p className="text-cyan-300 font-mono">support@codersmansion.com</p>
                <p className="text-slate-400 mt-1">
                  Please include your Order ID / Transaction Hash, product title, and reason for refund request. We review all requests within 24-48 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">5</span>
              Dispute Resolution & Chargebacks
            </h2>
            <p className="mb-3">
              We strongly encourage customers to reach out to us directly before initiating a payment dispute or chargeback with their financial institution. Most concerns can be resolved immediately without lengthy formal dispute processes.
            </p>
            <div className="flex items-center gap-3 text-amber-400/90 text-sm bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                Unauthorized or fraudulent chargeback attempts for services successfully rendered will result in permanent listing removal and blacklist from Quandrify network directories.
              </span>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">6</span>
              Processing Time for Approved Refunds
            </h2>
            <p className="text-slate-400">
              Once an approved refund is processed by our support team, funds are returned directly to your original payment method (Credit/Debit Card via Razorpay Balance). Refunds typically take <strong className="text-slate-200 font-medium">3 to 7 business days</strong> to appear on your bank account statement depending on your card issuer.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-900/30 text-xs text-slate-500 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Quandrify by Coders Mansion. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="text-cyan-400 hover:underline">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
