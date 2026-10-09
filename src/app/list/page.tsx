import React from 'react';
import { getTodayTop10Pool } from '@/lib/top10';
import ListingMultiStepForm from '@/components/ListingMultiStepForm';

export const revalidate = 0;

interface ListPageProps {
  searchParams: Promise<{
    top10?: string;
  }>;
}

export default async function ListPage({ searchParams }: ListPageProps) {
  const resolvedsearchParams = await searchParams;
  const top10Pool = await getTodayTop10Pool();
  const wantsTop10 = resolvedsearchParams.top10 === 'true';

  return (
    <div className="w-full min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          List Your Product on Quandrify
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          No traditional SaaS packages. No password required. Fill out your product profile, submit payment, and get published instantly.
        </p>
      </div>

      <ListingMultiStepForm
        remainingTop10Spots={top10Pool.remainingSlots}
        isTop10SoldOut={top10Pool.isSoldOut}
        initialTop10Addon={wantsTop10}
      />
    </div>
  );
}
