import React from 'react';
import { getTodayTop10Pool } from '@/lib/top10';
import { getPaginatedListings } from '@/lib/listings';
import LiveStatusWidget from '@/components/LiveStatusWidget';
import HeroTop3Cards from '@/components/HeroTop3Cards';
import Top10RemainingGrid from '@/components/Top10RemainingGrid';
import ListingsFeedSection from '@/components/ListingsFeedSection';

export const revalidate = 0; // Fresh dynamic data on every request

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedsearchParams = await searchParams;
  const page = parseInt(resolvedsearchParams.page || '1', 10);
  const category = resolvedsearchParams.category || 'All';
  const search = resolvedsearchParams.search || '';
  const sort = resolvedsearchParams.sort || 'newest';

  // Fetch Top 10 state first to exclude active Top 10 items from Discover feed (no duplicates)
  const top10Data = await getTodayTop10Pool();
  const activeTop10ListingIds = top10Data.spots
    .map((s) => s.listingId || s.listing?.id)
    .filter((id): id is string => Boolean(id));

  const feedData = await getPaginatedListings({
    page,
    pageSize: 100, // 100 listings per page requirement
    category,
    search,
    sortBy: sort,
    excludeIds: activeTop10ListingIds,
  });

  // Construct full 10-spot array (#1 to #10) so all 10 positions are always represented
  const allTop10Spots = Array.from({ length: 10 }, (_, i) => {
    const pos = i + 1;
    const found = top10Data.spots.find((s) => s.position === pos);
    return {
      position: pos,
      listing: found ? found.listing : null,
    };
  });

  const top3 = allTop10Spots.filter((s) => s.position <= 3);
  const remainingTop10 = allTop10Spots.filter((s) => s.position >= 4 && s.position <= 10);

  return (
    <div className="w-full space-y-4">
      {/* Live Top-10 Status Header Widget */}
      <LiveStatusWidget
        minimumToEnter={top10Data.minimumToEnter}
        claimedSlots={top10Data.claimedSlots}
        remainingSlots={top10Data.remainingSlots}
        isSoldOut={top10Data.isSoldOut}
      />

      {/* Hero Section: Today's Top 3 (#1 featured large, #2, #3) */}
      <HeroTop3Cards top3={top3} />

      {/* Paid Top 10 Remaining (#4 to #10 - Always shows positions 4 through 10 with badges!) */}
      <Top10RemainingGrid remainingSpots={remainingTop10} />

      {/* Discover Products Feed Section (100 items per page with pagination) */}
      <ListingsFeedSection
        initialListings={feedData.listings}
        totalCount={feedData.totalCount}
        currentPage={feedData.page}
        totalPages={feedData.totalPages}
        selectedCategory={category}
        searchQuery={search}
        sortBy={sort}
      />
    </div>
  );
}
