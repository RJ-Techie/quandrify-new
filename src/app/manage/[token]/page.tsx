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

  const todayPool = await getTodayTop10Pool();
  const todaySpot = todayPool.spots.find(s=>s.listingId === listing.id);

  return (
    <SellerManagementClient
      pendingPaymentId={(await db.payment.findFirst({ where: { listingId: listing.id, status: 'PENDING' }, orderBy: { createdAt: 'desc' } }))?.id}
      currentCredit={(await db.payment.aggregate({where:{listingId:listing.id,status:'SUCCEEDED'},_sum:{promotionalAmount:true}}))._sum.promotionalAmount || 0}
      minimumToEnter={todayPool.minimumToEnter}
      initialListing={listing}
      token={resolvedparams.token}
      todaySpotPosition={todaySpot ? todaySpot.position : null}
      remainingTop10Spots={todayPool.remainingSlots}
      isTop10SoldOut={todayPool.isSoldOut}
    />
  );
}
