import { publicListing } from './publicListing';
import { db } from './db';

export async function getPaginatedListings({
  page = 1,
  pageSize = 100,
  category,
  search,
  sortBy = 'newest',
  excludeIds = [],
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  excludeIds?: string[];
}) {
  page = Number.isFinite(page) ? Math.max(1, Math.min(10000, Math.floor(page))) : 1;
  pageSize = Math.max(1, Math.min(100, pageSize));
  const skip = (page - 1) * pageSize;

  const whereClause: any = {
    status: 'PUBLISHED',
  };

  if (excludeIds && excludeIds.length > 0) {
    whereClause.id = { notIn: excludeIds };
  }

  if (category && category !== 'All') {
    whereClause.category = category;
  }

  if (search && search.trim() !== '') {
    const query = search.trim();
    whereClause.OR = [
      { title: { contains: query } },
      { tagline: { contains: query } },
      { shortDescription: { contains: query } },
      { category: { contains: query } },
      { companyName: { contains: query } },
      { techFrontend: { contains: query } },
      { techBackend: { contains: query } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'trending' || sortBy === 'views') {
    orderBy = { viewCount: 'desc' };
  } else if (sortBy === 'clicks') {
    orderBy = { clickCount: 'desc' };
  } else if (sortBy === 'published') {
    orderBy = { publishedAt: 'desc' };
  }

  const [listings, totalCount] = await Promise.all([
    db.listing.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy,
    }),
    db.listing.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    listings: listings.map(publicListing),
    totalCount,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getListingBySlug(slug: string) {
  const listing = await db.listing.findUnique({
    where: { slug },
  });

  if (listing && listing.status === 'PUBLISHED') {
    // Increment view count asynchronously
    db.listing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {});
  }

  return listing && listing.status === 'PUBLISHED' ? publicListing(listing) : null;
}
