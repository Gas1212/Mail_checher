import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap Finder - Discover XML Sitemaps for Any Domain',
  description: 'Free sitemap finder tool. Discover and analyze XML sitemaps for any domain. Find sitemap locations, check URLs count, file size, and last modified dates. Try 3 times for free.',
  keywords: ['sitemap finder', 'find sitemap', 'sitemap discovery', 'xml sitemap finder', 'sitemap locator', 'sitemap analyzer', 'seo sitemap'],
  openGraph: {
    title: 'Sitemap Finder - Sugesto',
    description: 'Discover and analyze XML sitemaps for any domain. Get detailed sitemap information instantly.',
    url: 'https://sugesto.xyz/tools/sitemap-finder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap Finder - Sugesto',
    description: 'Find and analyze XML sitemaps for any website.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/sitemap-finder',
  },
};

export default function SitemapFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
