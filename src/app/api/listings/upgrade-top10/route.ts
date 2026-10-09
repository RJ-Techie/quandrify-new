import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTodayTop10Pool, getTodayDateString } from '@/lib/top10';

export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const { token, listingId, provider = 'stripe' } = await req.json();

    if (!token && !listingId) {
      return NextResponse.json({ error: 'Management token or listingId is required' }, { status: 400 });
    }

    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Valid seller token required' }, { status: 403 });
    const listing = await db.listing.findUnique({ where: { managementToken: token } });

    if (!listing || listing.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if listing already holds a spot today
    const todayStr = getTodayDateString();
    const existingSpot = await db.dailySpot.findFirst({
      where: {
        listingId: listing.id,
        date: todayStr,
      },
    });

    if (existingSpot) {
      return NextResponse.json(
        { error: `This product already holds spot #${existingSpot.position} in today's Top 10!` },
        { status: 400 }
      );
    }

    // Check pool availability
    const todayPool = await getTodayTop10Pool();
    if (todayPool.isSoldOut || todayPool.remainingSlots <= 0) {
      return NextResponse.json(
        { error: "Today's Top 10 is currently SOLD OUT. Spots reset at midnight UTC." },
        { status: 400 }
      );
    }

    // Create pending $99 payment record for Top-10 upgrade
    const payment = await db.payment.create({
      data: {
        listingId: listing.id,
        amount: 9900, // $99 in cents
        currency: 'usd',
        hasTop10Addon: true,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      listingId: listing.id,
      amount: 99,
      provider,
    });
  } catch (error: any) {
    console.error('Error creating Top 10 upgrade order:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}
