import { rateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/adminAuth';
import { digest } from '@/lib/security';
export async function POST(req: Request) {
  // Set TRUST_PROXY=true only behind a proxy that overwrites forwarded headers.
  const ip = process.env.TRUST_PROXY === 'true' ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown') : 'global';
  if (!await rateLimit(new URL(req.url).pathname + ':' + ip, 5)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const { email, password } = await req.json();
  if (typeof email !== 'string' || typeof password !== 'string' || password.length > 256)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  const admin = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin || !verifyPassword(password, admin.passwordHash))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = randomBytes(32).toString('hex');
  await db.adminSession.create({ data: { tokenHash: digest(token), adminId: admin.id, expiresAt: new Date(Date.now() + 86400000) } });
  const response = NextResponse.json({ success: true });
  response.cookies.set('quandrify_admin_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 86400 });
  return response;
}
