import { rateLimit } from '@/lib/rateLimit';
import { validateListing } from '@/lib/validation';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { getTodayDateString, getTodayTop10Pool } from '@/lib/top10';

export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const parsed = validateListing(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid listing fields', details: parsed.error.flatten() }, { status: 400 });
    const body = parsed.data;

    const {
      title,
      tagline,
      shortDescription,
      fullDescription,
      websiteUrl,
      logoUrl,
      primaryCtaText,
      coverImageUrl,
      demoUrl,
      videoUrl,
      category,
      companyName,
      founderName,
      foundedDate,
      country,
      city,
      teamSize,
      companyStage,
      revenueModel,
      mrr,
      arr,
      monthlyRevenue,
      annualRevenue,
      usersCount,
      mauCount,
      customersCount,
      payingCustomersCount,
      growthRate,
      publicMetrics, // Array of metric keys string[], e.g., ["mrr", "usersCount"]
      techFrontend,
      techBackend,
      techDatabase,
      techCloud,
      techAi,
      techPayment,
      customTech,
      linkWebsite,
      linkX,
      linkLinkedIn,
      linkInstagram,
      linkYouTube,
      linkGitHub,
      linkProductHunt,
      linkAppStore,
      linkGooglePlay,
      founderStoryWhy,
      founderStoryProblem,
      founderStoryNext,
      contactName,
      contactEmail,
      contactPhone,
      wantsTop10Addon, // boolean
    } = body;

    // Required fields validation
    if (!title || !tagline || !shortDescription || !fullDescription || !websiteUrl || !logoUrl || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields. Title, tagline, descriptions, website, logo, and contact info are required.' },
        { status: 400 }
      );
    }

    // Check Top-10 pool if add-on selected
    const todayPool = await getTodayTop10Pool();
    const canSelectTop10 = wantsTop10Addon && !todayPool.isSoldOut;

    // Calculate server price (NEVER trust frontend price)
    const baseListingFee = 49;
    const top10Fee = canSelectTop10 ? 99 : 0;
    const totalAmount = baseListingFee + top10Fee; // $49 or $148

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomCode = crypto.randomBytes(6).toString('hex');
    const slug = `${baseSlug}-${randomCode}`;

    // Cryptographically secure management token
    const managementToken = crypto.randomBytes(32).toString('hex');
    const managementTokenHash = crypto.createHash('sha256').update(managementToken).digest('hex');

    // Create pending listing
    const result = await db.$transaction(async tx => {
    const listing = await tx.listing.create({
      data: {
        slug,
        title,
        tagline,
        shortDescription,
        fullDescription,
        websiteUrl,
        logoUrl,
        primaryCtaText: primaryCtaText || 'Visit Website',
        coverImageUrl,
        demoUrl,
        videoUrl,
        category: category || 'Startup',
        companyName,
        founderName,
        foundedDate,
        country,
        city,
        teamSize,
        companyStage,
        revenueModel,
        mrr,
        arr,
        monthlyRevenue,
        annualRevenue,
        usersCount,
        mauCount,
        customersCount,
        payingCustomersCount,
        growthRate,
        publicMetricsJson: JSON.stringify(publicMetrics || []),
        techFrontend,
        techBackend,
        techDatabase,
        techCloud,
        techAi,
        techPayment,
        customTech,
        linkWebsite: linkWebsite || websiteUrl,
        linkX,
        linkLinkedIn,
        linkInstagram,
        linkYouTube,
        linkGitHub,
        linkProductHunt,
        linkAppStore,
        linkGooglePlay,
        founderStoryWhy,
        founderStoryProblem,
        founderStoryNext,
        contactName,
        contactEmail,
        contactPhone,
        status: 'PENDING',
        managementToken,
        managementTokenHash,
      },
    });

    // Create pending payment record
    const payment = await tx.payment.create({
      data: {
        listingId: listing.id,
        amount: totalAmount * 100, // cents (4900 or 14800)
        currency: 'usd',
        hasTop10Addon: canSelectTop10,
        status: 'PENDING',
      },
    });

    return { listing, payment };
    });
    const { listing, payment } = result;
    return NextResponse.json({
      success: true,
      listingId: listing.id,
      slug: listing.slug,
      paymentId: payment.id,
      amount: totalAmount,
      hasTop10Addon: canSelectTop10,
      managementToken: listing.managementToken,
    });
  } catch (error: any) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}
