import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getTodayTop10Pool, getTodayDateString } from '@/lib/top10';
import SellerManagementClient from '@/components/SellerManagementClient';

export const revalidate = 0;

interface ManagePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ManagePage({ params }: ManagePageProps) {
  const resolvedparams = await params;
  const listing = await db.listing.findUnique({
    where: { managementToken: resolvedparams.token },
  });

  if (!listing) {
    notFound();
  }

  const todayStr = getTodayDateString();
  const [todayPool, todaySpot] = await Promise.all([
    getTodayTop10Pool(),
    db.dailySpot.findFirst({
      where: {
        listingId: listing.id,
        date: todayStr,
      },
    }),
  ]);

  return (
    <SellerManagementClient
      pendingPaymentId={(await db.payment.findFirst({ where: { listingId: listing.id, status: 'PENDING' }, orderBy: { createdAt: 'desc' } }))?.id}
      initialListing={listing}
      token={resolvedparams.token}
      todaySpotPosition={todaySpot ? todaySpot.position : null}
      remainingTop10Spots={todayPool.remainingSlots}
      isTop10SoldOut={todayPool.isSoldOut}
    />
  );
}
