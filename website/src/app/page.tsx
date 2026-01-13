import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';

export const metadata: Metadata = {
  title: 'Sugesto - Professional Email Validation & SEO Tools',
  description: 'Validate emails with syntax, DNS, MX, and SMTP checks. Bulk email validation, sitemap tools, SPF generator, and blacklist checker. Fast, accurate, and reliable.',
  keywords: ['email validation', 'email checker', 'SMTP verification', 'bulk email validator', 'email verifier', 'DNS lookup', 'MX records'],
  openGraph: {
    title: 'Sugesto - Professional Email Validation & SEO Tools',
    description: 'Validate emails with syntax, DNS, MX, and SMTP checks. Bulk email validation, sitemap tools, SPF generator, and blacklist checker.',
    url: 'https://sugesto.xyz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sugesto - Professional Email Validation & SEO Tools',
    description: 'Validate emails with syntax, DNS, MX, and SMTP checks.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz',
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
