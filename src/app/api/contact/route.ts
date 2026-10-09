import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 30)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  try {
    const body = await req.json();
    const { listingId, senderName, senderEmail, senderCompany, senderWebsite, message, honeypot } = body;

    // Honeypot check for spam bots
    if (honeypot && honeypot.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    if (!listingId || !senderName || !senderEmail || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message exceeds maximum limit of 2000 characters.' },
        { status: 400 }
      );
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (typeof senderName !== 'string' || senderName.length > 150 || typeof senderEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail) || typeof message !== 'string') return NextResponse.json({ error: 'Invalid contact fields' }, { status: 400 });
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return NextResponse.json({ error: 'Messaging temporarily unavailable' }, { status: 503 });
    const contactRecord = await db.contactMessage.create({ data: { listingId, senderName, senderEmail, message, status: 'PENDING' } });
    const email = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': contactRecord.id }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: listing.contactEmail, reply_to: senderEmail, subject: `Quandrify inquiry: ${listing.title}`, text: `From ${senderName} (${senderEmail})\n\n${message}` }) });
    if (!email.ok) { await db.contactMessage.update({ where: { id: contactRecord.id }, data: { status: 'FAILED' } }); return NextResponse.json({ error: 'Unable to deliver inquiry' }, { status: 502 }); }
    await db.$transaction([db.contactMessage.update({ where: { id: contactRecord.id }, data: { status: 'DELIVERED' } }), db.listing.update({ where: { id: listingId }, data: { contactCount: { increment: 1 } } })]);
    return NextResponse.json({
      success: true,
      messageId: contactRecord.id,
      message: 'Your inquiry has been sent directly to the seller.',
    });
  } catch (error: any) {
    console.error('Contact seller API error:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}
