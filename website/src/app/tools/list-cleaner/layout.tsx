import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email List Cleaner - Remove Duplicates & Invalid Emails',
  description: 'Free email list cleaning tool. Remove duplicate emails, filter invalid addresses, and improve your mailing list quality instantly. Try 3 times for free, no signup required.',
  keywords: ['email list cleaner', 'remove duplicate emails', 'email validation', 'mailing list cleaner', 'email deduplication', 'clean email list'],
  openGraph: {
    title: 'Email List Cleaner - Sugesto',
    description: 'Remove duplicates and invalid emails from your mailing lists instantly. Improve deliverability.',
    url: 'https://sugesto.xyz/tools/list-cleaner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email List Cleaner - Sugesto',
    description: 'Clean your email lists by removing duplicates and invalid addresses.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/list-cleaner',
  },
};

export default function ListCleanerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
