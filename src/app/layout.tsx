import type { Metadata } from 'next';
import './globals.css';
import TopTickerBanner from '@/components/TopTickerBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SponsoredPopup from '@/components/SponsoredPopup';

export const metadata: Metadata = {
  title: { default: 'Quandrify — Claim Your Spot. Get Seen.', template: '%s | Quandrify' },
  icons: { icon: '/icon.svg' },
  description: 'Outbid-style direct product listing marketplace and permanent paid Top 10 showcase for startups, SaaS tools, and AI products.',
  keywords: ['startup directory', 'product hunt alternative', 'saas marketplace', 'ai tool listing', 'top 10 showcase'],
  openGraph: {
    title: 'Quandrify — Direct Product Listing & Paid Top 10 Platform',
    description: 'Claim your spot, pay directly, get published instantly, and feature in permanent paid Top 10 rankings.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <TopTickerBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SponsoredPopup />
      </body>
    </html>
  );
}
