import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap Validator - Validate XML Sitemaps for SEO',
  description: 'Free XML sitemap validator. Check your sitemap for errors, validate format, and ensure search engine compliance. Get SEO scores and best practice recommendations. Try 3 times for free.',
  keywords: ['sitemap validator', 'xml sitemap checker', 'sitemap validation', 'seo sitemap', 'google sitemap validator', 'sitemap analyzer'],
  openGraph: {
    title: 'Sitemap Validator - Sugesto',
    description: 'Validate your XML sitemap for errors and SEO best practices. Ensure proper search engine crawling.',
    url: 'https://sugesto.xyz/tools/sitemap-validator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap Validator - Sugesto',
    description: 'Validate XML sitemaps for errors and SEO compliance.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/sitemap-validator',
  },
};

export default function SitemapValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
