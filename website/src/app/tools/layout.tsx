import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email & SEO Tools',
  description: 'Explore our comprehensive suite of email validation and SEO tools including email checker, bulk validator, sitemap tools, SPF generator, blacklist checker and more.',
  keywords: ['email tools', 'SEO tools', 'validation tools', 'webmaster tools', 'email checker', 'sitemap validator', 'SPF generator', 'blacklist checker'],
  openGraph: {
    title: 'Email & SEO Tools - Sugesto',
    description: 'Explore our comprehensive suite of email validation and SEO tools including email checker, bulk validator, sitemap tools, and more.',
    url: 'https://sugesto.xyz/tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email & SEO Tools - Sugesto',
    description: 'Comprehensive suite of email validation and SEO tools.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
