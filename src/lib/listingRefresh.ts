 'use client';
export function notifyListingChange() {
 window.dispatchEvent(new Event('quandrify-listings-changed'));
 try {
  const channel = new BroadcastChannel('quandrify-listings');
  channel.postMessage('changed');
  channel.close();
 } catch { /* Visible marketplace pages also poll and refresh on focus. */ }
}
