import React from 'react';
import { notFound } from 'next/navigation';
import { getListingBySlug } from '@/lib/listings';
import { db } from '@/lib/db';
import { getTodayDateString, getTodayTop10Pool } from '@/lib/top10';
import ListingDetailClient from '@/components/ListingDetailClient';
import ListingCard from '@/components/ListingCard';
import ProductGallery from '@/components/ProductGallery';
import ShareProduct from '@/components/ShareProduct';
import SaveProduct from '@/components/SaveProduct';
import ReportListing from '@/components/ReportListing';
import { publicListing } from '@/lib/publicListing';
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
    twitter: {card: 'summary_large_image',title:listing.title,description:listing.tagline,images:[`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.quandrify.com'}/api/share/${listing.slug}`]},
    openGraph: {
      title: `${listing.title} on Quandrify`,
      description: listing.shortDescription,
      images: [{url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.quandrify.com'}/api/share/${listing.slug}`,width:1200,height:630}],
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

  const related=await db.listing.findMany({where:{status:'PUBLISHED',category:listing.category,id:{not:listing.id}},orderBy:{publishedAt:'desc'},take:3});
  return (
    <><ListingDetailClient
      listing={listing}
      top10Spot={top10Spot || null}
      remainingTop10Spots={todayPool.remainingSlots}
      isTop10SoldOut={todayPool.isSoldOut}
    /><section className="max-w-5xl mx-auto px-4 pb-10 space-y-5"><ProductGallery urls={listing.screenshotUrls} title={listing.title}/><ShareProduct slug={listing.slug} title={listing.title} tagline={listing.tagline}/><SaveProduct id={listing.id}/><ReportListing listingId={listing.id}/>{related.length>0&&<div className="space-y-4 pt-6"><h2 className="text-2xl font-bold">More in {listing.category}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{related.map(l=><ListingCard key={l.id} listing={publicListing(l)}/>)}</div></div>}</section></>
  );
}
