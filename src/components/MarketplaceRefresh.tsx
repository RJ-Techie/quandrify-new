 'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MarketplaceRefresh() {
 const pathname = usePathname();
 const router = useRouter();
 useEffect(() => {
  const routes = ['/', '/search', '/codersmansion/admin/listings', '/codersmansion/admin/top-spots'];
  if (!routes.includes(pathname) && !pathname.startsWith('/collections') && !pathname.startsWith('/listing/')) return;
  let lastRefresh = 0;
  const refresh = () => {
   if (document.visibilityState !== 'visible' || Date.now() - lastRefresh < 2000) return;
   lastRefresh = Date.now();
   router.refresh();
  };
  const onChange = () => { lastRefresh = 0; refresh(); };
  let channel: BroadcastChannel | undefined;
  try { channel = new BroadcastChannel('quandrify-listings'); channel.onmessage = onChange; } catch {}
  refresh();
  const interval = window.setInterval(refresh, 15000);
  window.addEventListener('focus', refresh);
  window.addEventListener('quandrify-listings-changed', onChange);
  document.addEventListener('visibilitychange', refresh);
  return () => {
   window.clearInterval(interval);
   window.removeEventListener('focus', refresh);
   window.removeEventListener('quandrify-listings-changed', onChange);
   document.removeEventListener('visibilitychange', refresh);
   channel?.close();
  };
 }, [pathname, router]);
 return null;
}
