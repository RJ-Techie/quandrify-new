import { rateLimit } from '@/lib/rateLimit';
import { validateListing } from '@/lib/validation';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const listing = await db.listing.findUnique({
      where: { managementToken: token },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Invalid or expired management token' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const parsed = validateListing(await req.json(), true);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
    const body = parsed.data;

    const existing = await db.listing.findUnique({
      where: { managementToken: token },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invalid management token' }, { status: 404 });
    }

    const {
      title,
      tagline,
      shortDescription,
      fullDescription,
      websiteUrl,
      logoUrl,
      primaryCtaText,
      category,
      companyName,
      founderName,
      foundedDate,
      country,
      city,
      teamSize,
      companyStage,
      mrr,
      arr,
      usersCount,
      customersCount,
      publicMetrics,
      techFrontend,
      techBackend,
      techDatabase,
      techAi,
      linkX,
      linkGitHub,
      linkLinkedIn,
    } = body;

    const updated = await db.listing.update({
      where: { id: existing.id },
      data: {
        title: title || existing.title,
        tagline: tagline || existing.tagline,
        shortDescription: shortDescription || existing.shortDescription,
        fullDescription: fullDescription || existing.fullDescription,
        websiteUrl: websiteUrl || existing.websiteUrl,
        logoUrl: logoUrl || existing.logoUrl,
        primaryCtaText: primaryCtaText || existing.primaryCtaText,
        category: category || existing.category,
        companyName,
        founderName,
        foundedDate,
        country,
        city,
        teamSize,
        companyStage,
        mrr,
        arr,
        usersCount,
        customersCount,
        publicMetricsJson: publicMetrics ? JSON.stringify(publicMetrics) : existing.publicMetricsJson,
        techFrontend,
        techBackend,
        techDatabase,
        techAi,
        linkX,
        linkGitHub,
        linkLinkedIn,
      },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const existing = await db.listing.findUnique({
      where: { managementToken: token },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invalid management token' }, { status: 404 });
    }

    await db.listing.update({
      where: { id: existing.id },
      data: { status: 'ARCHIVED' },
    });

    return NextResponse.json({ success: true, message: 'Listing has been archived.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
