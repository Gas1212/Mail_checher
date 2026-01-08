import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Validator - Free Email Verification Tool',
  description: 'Validate email addresses for free with comprehensive checks. Verify syntax, DNS, MX records, and detect disposable emails. Try 3 times for free, no signup required.',
  keywords: ['email validator', 'email verification', 'email checker', 'validate email', 'email syntax check', 'disposable email detector'],
  openGraph: {
    title: 'Free Email Validator - Sugesto',
    description: 'Validate email addresses with syntax, DNS, MX, and disposable checks. Try 3 times for free.',
    url: 'https://sugesto.xyz/tools/email-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Email Validator - Sugesto',
    description: 'Validate email addresses with comprehensive checks.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/email-checker',
  },
};

export default function EmailCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
