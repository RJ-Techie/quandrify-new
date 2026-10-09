'use client';
import { startCheckout } from '@/lib/checkout';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
  Zap,
  Globe,
  Layers,
  Cpu,
  Share2,
  BookOpen,
  User,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Crown,
  Flame,
} from 'lucide-react';

interface FormProps {
  remainingTop10Spots: number;
  isTop10SoldOut: boolean;
  initialTop10Addon?: boolean;
}

const CATEGORIES = [
  'Startup',
  'SaaS',
  'AI Tool',
  'Mobile App',
  'Website',
  'Product',
  'Creator',
  'Business',
  'Service',
  'Course',
  'Other',
];

const STAGES = ['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Bootstrapped', 'Profitable'];

export default function ListingMultiStepForm({
  remainingTop10Spots,
  isTop10SoldOut,
  initialTop10Addon = false,
}: FormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const paymentProvider = 'stripe' as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    category: 'SaaS',
    title: '',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    websiteUrl: '',
    logoUrl: '',
    primaryCtaText: 'Visit Website',
    coverImageUrl: '',
    demoUrl: '',
    videoUrl: '',

    companyName: '',
    founderName: '',
    foundedDate: '',
    country: 'United States',
    city: '',
    teamSize: '1-5',
    companyStage: 'Bootstrapped',

    revenueModel: 'SaaS Subscription',
    mrr: '',
    arr: '',
    monthlyRevenue: '',
    annualRevenue: '',
    usersCount: '',
    mauCount: '',
    customersCount: '',
    payingCustomersCount: '',
    growthRate: '',
    publicMetrics: ['mrr', 'usersCount'] as string[],

    techFrontend: '',
    techBackend: '',
    techDatabase: '',
    techCloud: '',
    techAi: '',
    techPayment: '',
    customTech: '',

    linkWebsite: '',
    linkX: '',
    linkLinkedIn: '',
    linkInstagram: '',
    linkYouTube: '',
    linkGitHub: '',
    linkProductHunt: '',
    linkAppStore: '',
    linkGooglePlay: '',

    founderStoryWhy: '',
    founderStoryProblem: '',
    founderStoryNext: '',

    contactName: '',
    contactEmail: '',
    contactPhone: '',

    wantsTop10Addon: initialTop10Addon && !isTop10SoldOut,
  });

  // Keep wantsTop10Addon in sync if initialTop10Addon changes
  useEffect(() => {
    if (initialTop10Addon && !isTop10SoldOut) {
      setFormData((prev) => ({ ...prev, wantsTop10Addon: true }));
    }
  }, [initialTop10Addon, isTop10SoldOut]);

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

  const validateStep = (step: number) => {
    setErrorMsg('');
    if (step === 2) {
      if (!formData.title.trim()) return 'Product name is required.';
      if (!formData.tagline.trim()) return 'Tagline is required.';
      if (!formData.shortDescription.trim()) return 'Short description is required.';
      if (!formData.fullDescription.trim()) return 'Full description is required.';
      if (!formData.websiteUrl.trim()) return 'Website URL is required.';
      if (!formData.logoUrl.trim()) return 'Logo URL is required.';
    }
    if (step === 8) {
      if (!formData.contactName.trim()) return 'Contact name is required.';
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) return 'Valid email is required.';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 9));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAndPay = async () => {
    const err = validateStep(8);
    if (err) {
      setErrorMsg(err);
      setCurrentStep(8);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Create Pending Listing & Payment Record
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit listing');
      }

      // 2. Route to selected payment provider
      await startCheckout(data.paymentId, data.managementToken);
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const totalFee = 49 + (formData.wantsTop10Addon && !isTop10SoldOut ? 99 : 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* PROMINENT TOP-10 SPOT SELECTION WIDGET (VISIBLE ON ALL STEPS) */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          formData.wantsTop10Addon && !isTop10SoldOut
            ? 'bg-gradient-to-r from-amber-950/60 via-dark-900 to-slate-900 border-amber-500/60 shadow-2xl shadow-amber-950/50'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base">Claim Today's Top 10 Position</h3>
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +$99 ADD-ON
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isTop10SoldOut ? (
                  <span className="text-rose-400 font-semibold">Today's Top 10 is SOLD OUT. Spots reset at midnight UTC.</span>
                ) : (
                  <span>
                    🚀 <strong className="text-amber-300">Get noticed by active VCs & tech buyers</strong> ({remainingTop10Spots} of 10 spots remaining).
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                disabled={isTop10SoldOut}
                checked={formData.wantsTop10Addon && !isTop10SoldOut}
                onChange={(e) => handleChange('wantsTop10Addon', e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs font-black text-white">
                {formData.wantsTop10Addon && !isTop10SoldOut ? 'Top 10 (+$99)' : 'Add Top 10 (+$99)'}
              </span>
            </label>

            <div className="text-right pl-3 border-l border-slate-800">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Total Fee</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">${totalFee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Header Indicator */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Step {currentStep} of 9</span>
          <span className="text-amber-400 font-extrabold">
            {currentStep === 9 ? 'Payment & Publish' : `Step ${currentStep}`}
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-10 shadow-2xl">
        {/* STEP 1: Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 1 — What are you listing?</h2>
              <p className="text-slate-400 text-sm mt-1">Select the primary category for your product.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange('category', cat)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                    formData.category === cat
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat}</span>
                    {formData.category === cat && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Basic Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 2 — Basic Information</h2>
              <p className="text-slate-400 text-sm mt-1">Enter your product details and brand asset URLs.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. AIFlow Engine"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline *</label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous AI Agent Workflow Automation Platform"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Website URL *</label>
                  <input
                    type="url"
                    placeholder="https://yourproduct.com"
                    value={formData.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Logo Image URL *</label>
                  <input
                    type="url"
                    placeholder="https://yourproduct.com/logo.png"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary displayed on card preview..."
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Description *</label>
                <textarea
                  rows={4}
                  placeholder="Detailed overview for the listing profile page..."
                  value={formData.fullDescription}
                  onChange={(e) => handleChange('fullDescription', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Company */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 3 — Company Information</h2>
              <p className="text-slate-400 text-sm mt-1">Tell us about your organization and founding team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. AIFlow Inc."
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Founder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={formData.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Founded Date / Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2024"
                  value={formData.foundedDate}
                  onChange={(e) => handleChange('foundedDate', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Business Info */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 4 — Business Information & Metrics</h2>
              <p className="text-slate-400 text-sm mt-1">
                Optional traction data. Use the toggle buttons to control what metrics are shown publicly or kept private.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Monthly Recurring Revenue (MRR)</label>
                  <button
                    type="button"
                    onClick={() => togglePublicMetric('mrr')}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                      formData.publicMetrics.includes('mrr')
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {formData.publicMetrics.includes('mrr') ? (
                      <><Eye className="w-3 h-3" /> Show Publicly</>
                    ) : (
                      <><EyeOff className="w-3 h-3" /> Keep Private</>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. $42,500"
                  value={formData.mrr}
                  onChange={(e) => handleChange('mrr', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Total Users</label>
                  <button
                    type="button"
                    onClick={() => togglePublicMetric('usersCount')}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                      formData.publicMetrics.includes('usersCount')
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {formData.publicMetrics.includes('usersCount') ? (
                      <><Eye className="w-3 h-3" /> Show Publicly</>
                    ) : (
                      <><EyeOff className="w-3 h-3" /> Keep Private</>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 18,400"
                  value={formData.usersCount}
                  onChange={(e) => handleChange('usersCount', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 to 7: Tech, Social, Founder Story */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 5 — Technology Stack</h2>
              <p className="text-slate-400 text-sm mt-1">Specify technologies used to build your application.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Frontend Frameworks</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, React, TailwindCSS"
                  value={formData.techFrontend}
                  onChange={(e) => handleChange('techFrontend', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Backend & API</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Python, FastAPI"
                  value={formData.techBackend}
                  onChange={(e) => handleChange('techBackend', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 6 — Social Links</h2>
              <p className="text-slate-400 text-sm mt-1">Connect your product social channels.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">X (Twitter) URL</label>
                <input
                  type="url"
                  placeholder="https://x.com/yourhandle"
                  value={formData.linkX}
                  onChange={(e) => handleChange('linkX', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={formData.linkGitHub}
                  onChange={(e) => handleChange('linkGitHub', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 7 — Founder Story</h2>
              <p className="text-slate-400 text-sm mt-1">Share why you built this product.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Why did you build it?</label>
              <textarea
                rows={3}
                placeholder="What inspired you?"
                value={formData.founderStoryWhy}
                onChange={(e) => handleChange('founderStoryWhy', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Contact */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Step 8 — Verified Contact Email</h2>
              <p className="text-slate-400 text-sm mt-1">
                No passwords or account signup required! Save your secure seller link after checkout.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Email Address *</label>
                <input
                  type="email"
                  placeholder="alex@yourproduct.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Payment & Publish Screen with Razorpay & Razorpay Option */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white">Publish Your Listing</h2>
              <p className="text-slate-400 text-sm mt-1">
                Select your preferred payment method below to publish your listing instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">Standard Listing Fee</h3>
                  <p className="text-xs text-slate-400">Lifetime published listing, crawlable SEO profile, and buyer contact proxy.</p>
                </div>
                <span className="text-2xl font-black text-white">$49</span>
              </div>

              {/* Optional Top 10 Addon Checkbox */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.wantsTop10Addon && !isTop10SoldOut
                    ? 'bg-gradient-to-r from-amber-950/40 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="top10ToggleStep9"
                    disabled={isTop10SoldOut}
                    checked={formData.wantsTop10Addon && !isTop10SoldOut}
                    onChange={(e) => handleChange('wantsTop10Addon', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 mt-0.5 cursor-pointer disabled:opacity-50"
                  />
                  <div>
                    <label htmlFor="top10ToggleStep9" className="font-extrabold text-white text-sm cursor-pointer flex items-center gap-2">
                      <span>Want today's Top 10? Claim the next available spot</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        + $99
                      </span>
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      {isTop10SoldOut ? (
                        <span className="text-rose-400 font-semibold">Today's Top 10 is SOLD OUT. Next spots reset at midnight.</span>
                      ) : (
                        <span>
                          Current availability: <strong className="text-amber-400">{remainingTop10Spots} of 10 spots available</strong> today.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure checkout in USD via Razorpay. Top 10 runs until midnight UTC; if today fills during checkout, placement moves to the next available day. */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Secure checkout in USD via Razorpay. Top 10 runs until midnight UTC; if today fills during checkout, placement moves to the next available day.
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Credit Card */}
                  

                  {/* Razorpay Account */}
                  
                </div>
              </div>

              {/* Total Calculation & CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs uppercase font-bold text-slate-400">Total Due Now</span>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">${totalFee}</p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitAndPay}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl active:scale-95 transition-all disabled:opacity-50 text-center ${
                    paymentProvider === 'paypal'
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-400/25'
                      : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white shadow-indigo-600/25'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      {paymentProvider === 'paypal' ? (
                        <Wallet className="w-5 h-5 fill-slate-950 shrink-0" />
                      ) : (
                        <CreditCard className="w-5 h-5 shrink-0" />
                      )}
                      <span>Pay securely in USD (${totalFee})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={prevStep}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 hover:bg-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 9 && (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
