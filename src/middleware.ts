import { NextRequest, NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && !req.nextUrl.pathname.endsWith('/webhook')) {
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }
  if (Number(req.headers.get('content-length') || 0) > (req.nextUrl.pathname === '/api/media/upload' ? 262144 : 65536)) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  const response = NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/manage') || req.nextUrl.pathname.startsWith('/list/success') || (req.nextUrl.pathname.startsWith('/api') && !/^\/api\/media\/[^/]+$/.test(req.nextUrl.pathname))) response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
export const config = { matcher: ['/api/:path*', '/manage/:path*', '/list/success'] };
