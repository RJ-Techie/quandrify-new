import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const admin = await verifyAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { listingId, action } = await req.json();

    if (!listingId || !action) {
      return NextResponse.json({ error: 'Missing listingId or action' }, { status: 400 });
    }

    if (!['PUBLISH', 'SUSPEND', 'ARCHIVE', 'TOGGLE_FEATURED'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    let updateData: any = {};
    if (action === 'PUBLISH') updateData = { status: 'PUBLISHED', publishedAt: new Date() };
    if (action === 'SUSPEND') updateData = { status: 'SUSPENDED' };
    if (action === 'ARCHIVE') updateData = { status: 'ARCHIVED' };
    if (action === 'TOGGLE_FEATURED') {
      const current = await db.listing.findUnique({ where: { id: listingId } });
      updateData = { isFeatured: !current?.isFeatured };
    }

    const updated = await db.listing.update({
      where: { id: listingId },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        action: `ADMIN_${action}`,
        actor: admin.email,
        details: `Updated listing ${listingId} (${updated.title})`,
      },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
