'use client';
import { validateListing } from '@/lib/validation';
import RankingRules from './RankingRules';
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
  const [couponCode,setCouponCode]=useState('');
  const [discount,setDiscount]=useState(0);
  const [couponMessage,setCouponMessage]=useState('');
  const [fieldErrors,setFieldErrors]=useState<Record<string,string[]>>({});
  const [rulesAccepted,setRulesAccepted]=useState(false);

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
    const result=validateListing({[field]:value},true);setFieldErrors(prev=>({...prev,[field]:result.success?[]:(result.error.flatten().fieldErrors as Record<string,string[]>)[field] || []}));
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
    const parsed = validateListing(formData);
    const all = parsed.success ? {} : parsed.error.flatten().fieldErrors;
    const keys = step === 2 ? ['title','tagline','shortDescription','fullDescription','websiteUrl','logoUrl','coverImageUrl','demoUrl','videoUrl'] : step === 8 ? ['contactName','contactEmail'] : step === 6 ? Object.keys(all).filter(k=>k.startsWith('link')) : [];
    const selected = Object.fromEntries(Object.entries(all).filter(([k])=>keys.includes(k))) as Record<string,string[]>;
    setFieldErrors(selected);
    return Object.keys(selected).length ? Object.entries(selected).map(([key,values])=>`${key}: ${values.join(', ')}`).join('; ') : null;
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
    if(!rulesAccepted){setErrorMsg('Please read and accept the listing and ranking rules.');return;}
    const parsed = validateListing(formData);
    if(!parsed.success){const fields=parsed.error.flatten().fieldErrors as Record<string,string[]>;setFieldErrors(fields);const first=Object.keys(fields)[0];setCurrentStep(first?.startsWith('contact')?8:first?.startsWith('link')?6:2);setErrorMsg(Object.entries(fields).map(([k,v])=>`${k}: ${v.join(', ')}`).join('; '));return;}
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
        body: JSON.stringify({...formData,couponCode}),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const fields=data.details?.fieldErrors; if(fields)setFieldErrors(fields);
        throw new Error(fields ? Object.entries(fields).map(([k,v])=>`${k}: ${(v as string[]).join(', ')}`).join('; ') : data.error || 'Failed to submit listing');
      }

      // 2. Route to selected payment provider
      await startCheckout(data.paymentId, data.managementToken);
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const totalFee = (1000-discount)/100;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <RankingRules />
      <p className="text-xs text-slate-400">Logo example: https://example.com/logo.png. Required fields are marked *. Optional links may remain blank.</p>
      <p className="text-sm text-slate-400">Listing: $10 USD. Paid ranking has no expiry or reset. The highest cumulative payments occupy Top 10.</p>
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
                    {fieldErrors.title?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.title.join(", ")}</p>}
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
                    {fieldErrors.tagline?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.tagline.join(", ")}</p>}
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
                    {fieldErrors.websiteUrl?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.websiteUrl.join(", ")}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Logo Image URL *</label>
                  <input
                    type="url"
                    placeholder="https://yourproduct.com/logo.png"
                    onBlur={()=>validateStep(2)}
                    value={formData.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                    {fieldErrors.logoUrl?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.logoUrl.join(", ")}</p>}
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
                    {fieldErrors.shortDescription?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.shortDescription.join(", ")}</p>}
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
                    {fieldErrors.fullDescription?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.fullDescription.join(", ")}</p>}
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
                    {fieldErrors.companyName?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.companyName.join(", ")}</p>}
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
                    {fieldErrors.founderName?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.founderName.join(", ")}</p>}
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
                    {fieldErrors.foundedDate?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.foundedDate.join(", ")}</p>}
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
                    {fieldErrors.country?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.country.join(", ")}</p>}
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
                    {fieldErrors.mrr?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.mrr.join(", ")}</p>}
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
                    {fieldErrors.usersCount?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.usersCount.join(", ")}</p>}
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
                    {fieldErrors.techFrontend?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.techFrontend.join(", ")}</p>}
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
                    {fieldErrors.techBackend?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.techBackend.join(", ")}</p>}
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
                    {fieldErrors.linkX?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.linkX.join(", ")}</p>}
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
                    {fieldErrors.linkGitHub?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.linkGitHub.join(", ")}</p>}
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
                    {fieldErrors.founderStoryWhy?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.founderStoryWhy.join(", ")}</p>}
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
                    {fieldErrors.contactName?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.contactName.join(", ")}</p>}
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
                    {fieldErrors.contactEmail?.length > 0 && <p role="alert" className="text-xs text-rose-300 mt-1">{fieldErrors.contactEmail.join(", ")}</p>}
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
                <span className="text-2xl font-black text-white">$10</span>
              </div>

              <RankingRules />
              <label className="block text-sm">Coupon code<input className="block w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mt-2" value={couponCode} onChange={e=>{setCouponCode(e.target.value);setDiscount(0);setCouponMessage('');}} maxLength={40}/></label>
              <button type="button" onClick={async()=>{const res=await fetch('/api/coupons/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:couponCode})});const data=await res.json();setDiscount(res.ok?data.discount:0);setCouponMessage(res.ok?`Discount: $${(data.discount/100).toFixed(2)}. Ranking credit: $${(data.amount/100).toFixed(2)}.`:data.error);}}>Apply coupon</button>
              <p role="status">{couponMessage}</p>
              <label className="flex gap-3 text-sm"><input type="checkbox" checked={rulesAccepted} onChange={e=>setRulesAccepted(e.target.checked)}/>I understand the paid ranking rules, including displacement and no guaranteed position.</label>
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
