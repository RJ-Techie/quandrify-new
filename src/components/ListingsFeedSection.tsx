'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingCard, { ListingCardData } from './ListingCard';
import { Search, Compass, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface ListingsFeedProps {
  initialListings: ListingCardData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
}

const CATEGORIES = [
  'All',
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
];

export default function ListingsFeedSection({
  initialListings,
  totalCount,
  currentPage,
  totalPages,
  selectedCategory,
  searchQuery,
  sortBy,
}: ListingsFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchQuery || '');

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/?${params.toString()}#feed`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  return (
    <section id="feed" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Feed Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" /> EXPLORE MARKETPLACE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discover Products
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse published products, SaaS applications, and AI tools across all categories.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products, tech..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </form>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sort: e.target.value, page: 1 })}
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="trending">Sort: Trending</option>
              <option value="views">Sort: Most Viewed</option>
              <option value="clicks">Sort: Most Clicks</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills with touch horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = (selectedCategory || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => updateFilters({ category: cat, page: 1 })}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Listings Count Bar */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-slate-400 mb-4 sm:mb-6">
        <span>
          Showing <strong className="text-white">{initialListings.length}</strong> of{' '}
          <strong className="text-white">{totalCount}</strong> published listings
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Listings Grid (Up to 100 per page) */}
      {initialListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {initialListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="w-full py-12 sm:py-16 text-center rounded-3xl bg-slate-900/50 border border-slate-800 px-4">
          <p className="text-slate-400 text-sm sm:text-base">No listings found matching your search criteria.</p>
          <button
            onClick={() => {
              setSearchInput('');
              updateFilters({ search: null, category: null, page: 1 });
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* URL Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateFilters({ page: currentPage - 1 })}
            className="flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => updateFilters({ page: pageNum })}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-extrabold transition-all border ${
                  pageNum === currentPage
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateFilters({ page: currentPage + 1 })}
            className="flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
