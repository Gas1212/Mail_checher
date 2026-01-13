import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk Email Checker - Validate Multiple Emails at Once',
  description: 'Validate multiple email addresses simultaneously with our bulk email checker. Upload CSV, paste from Excel, or enter emails line by line. Export results instantly. Try 3 times for free.',
  keywords: ['bulk email validator', 'bulk email checker', 'validate multiple emails', 'email list validation', 'CSV email validation', 'batch email verification'],
  openGraph: {
    title: 'Bulk Email Checker - Sugesto',
    description: 'Validate multiple email addresses at once. Upload, validate, and export results instantly.',
    url: 'https://sugesto.xyz/tools/bulk-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Email Checker - Sugesto',
    description: 'Validate multiple email addresses simultaneously with instant results.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/bulk-checker',
  },
};

export default function BulkCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
