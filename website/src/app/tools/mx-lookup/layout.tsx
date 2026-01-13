import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MX Lookup - Check Mail Exchange Records & DNS Configuration',
  description: 'Free MX record lookup tool. Check mail exchange records, verify DNS configuration, and test email server setup for any domain. Try 3 times for free, no signup required.',
  keywords: ['mx lookup', 'mx record checker', 'mail exchange records', 'dns lookup', 'email server check', 'mx records test', 'domain email configuration'],
  openGraph: {
    title: 'MX Lookup Tool - Sugesto',
    description: 'Check MX records and DNS configuration for any domain. Verify email server setup instantly.',
    url: 'https://sugesto.xyz/tools/mx-lookup',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MX Lookup Tool - Sugesto',
    description: 'Check mail exchange records and DNS configuration for any domain.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/mx-lookup',
  },
};

export default function MXLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
