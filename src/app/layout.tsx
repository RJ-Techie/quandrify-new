import type { Metadata } from 'next';
import './globals.css';
import TopTickerBanner from '@/components/TopTickerBanner';
import Header from '@/components/Header';
import MarketplaceRefresh from '@/components/MarketplaceRefresh';
import Footer from '@/components/Footer';
import SponsoredPopup from '@/components/SponsoredPopup';

export const metadata: Metadata = {
  title: { default: 'Quandrify — Discover useful products', template: '%s | Quandrify' },
  icons: { icon: '/icon.svg' },
  description: 'Discover AI tools, SaaS and independent products. Browse by category, save a shortlist and connect with builders.',
  keywords: ['startup directory', 'product hunt alternative', 'saas marketplace', 'ai tool listing', 'top 10 showcase'],
  openGraph: {
    title: 'Quandrify — Discover AI tools, SaaS and independent products',
    description: 'Find useful products, explore new launches and save your next favorite tool.',
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
        <MarketplaceRefresh />
        <Footer />
        <SponsoredPopup />
      </body>
    </html>
  );
}
