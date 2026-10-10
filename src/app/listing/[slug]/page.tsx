import React from 'react';
import { notFound } from 'next/navigation';
import { getListingBySlug } from '@/lib/listings';
import { db } from '@/lib/db';
import { getTodayDateString, getTodayTop10Pool } from '@/lib/top10';
import ListingDetailClient from '@/components/ListingDetailClient';
import type { Metadata } from 'next';

export const revalidate = 0;

interface ListingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const resolvedparams = await params;
  const listing = await db.listing.findUnique({
    where: { slug: resolvedparams.slug },
  });

  if (!listing || listing.status !== 'PUBLISHED') {
    return {
      title: 'Listing Not Found — Quandrify',
    };
  }

  return {
    title: `${listing.title} — ${listing.tagline} | Quandrify`,
    description: listing.shortDescription,
    openGraph: {
      title: `${listing.title} on Quandrify`,
      description: listing.shortDescription,
      images: [listing.logoUrl],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const resolvedparams = await params;
  const listing = await getListingBySlug(resolvedparams.slug);

  if (!listing || listing.status !== 'PUBLISHED') {
    notFound();
  }

  const todayPool = await getTodayTop10Pool();
  const top10Spot = todayPool.spots.find(s=>s.listingId === listing.id);

  return (
    <ListingDetailClient
      listing={listing}
      top10Spot={top10Spot || null}
      remainingTop10Spots={todayPool.remainingSlots}
      isTop10SoldOut={todayPool.isSoldOut}
    />
  );
}
