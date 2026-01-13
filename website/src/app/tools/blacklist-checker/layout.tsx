import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blacklist Checker - Check if Your Domain or IP is Blacklisted',
  description: 'Free email blacklist checker. Check if your domain or IP address is listed on major spam blacklists (Spamhaus, Barracuda, SpamCop). Protect your sender reputation. Try 3 times for free.',
  keywords: ['blacklist checker', 'spam blacklist', 'dnsbl lookup', 'ip blacklist check', 'domain blacklist', 'email reputation', 'spamhaus check'],
  openGraph: {
    title: 'Blacklist Checker - Sugesto',
    description: 'Check if your domain or IP is listed on spam blacklists. Protect your email reputation.',
    url: 'https://sugesto.xyz/tools/blacklist-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blacklist Checker - Sugesto',
    description: 'Check if your domain or IP is blacklisted on major spam databases.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/blacklist-checker',
  },
};

export default function BlacklistCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
