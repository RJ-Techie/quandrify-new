import React from 'react';
import { getPaginatedListings } from '@/lib/listings';
import { getTodayTop10Pool } from '@/lib/top10';
import ListingsFeedSection from '@/components/ListingsFeedSection';

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedsearchParams = await searchParams;
  const page = parseInt(resolvedsearchParams.page || '1', 10);
  const category = resolvedsearchParams.category || 'All';
  const search = resolvedsearchParams.search || '';
  const sort = resolvedsearchParams.sort || 'newest';

  const top10Data = await getTodayTop10Pool();
  const activeTop10ListingIds = top10Data.spots
    .map((s) => s.listingId || s.listing?.id)
    .filter((id): id is string => Boolean(id));

  const feedData = await getPaginatedListings({
    page,
    pageSize: 100,
    category,
    search,
    sortBy: sort,
    excludeIds: activeTop10ListingIds,
  });

  return (
    <div className="w-full py-6">
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
