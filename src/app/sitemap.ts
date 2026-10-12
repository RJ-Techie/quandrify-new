export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import {collections} from '@/lib/collections';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quandrify.com';

  const publishedListings = await db.listing.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const listingUrls = publishedListings.map((item) => ({
    url: `${baseUrl}/listing/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {url:`${baseUrl}/collections`,changeFrequency:'weekly',priority:0.8},
    ...collections.map(c=>({url:`${baseUrl}/collections/${c.key}`,changeFrequency:'weekly' as const,priority:0.7})),
    ...listingUrls,
  ];
}
