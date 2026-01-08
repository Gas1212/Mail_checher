import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPF Record Generator - Create SPF Records for Email Authentication',
  description: 'Free SPF record generator. Create Sender Policy Framework records to prevent email spoofing and improve deliverability. Configure mail servers, IPs, and policies. Try 3 times for free.',
  keywords: ['spf generator', 'spf record', 'sender policy framework', 'email authentication', 'email spoofing protection', 'spf txt record', 'email security'],
  openGraph: {
    title: 'SPF Record Generator - Sugesto',
    description: 'Generate SPF records for your domain. Prevent email spoofing and improve deliverability.',
    url: 'https://sugesto.xyz/tools/spf-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPF Record Generator - Sugesto',
    description: 'Create SPF records to authenticate your email and prevent spoofing.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/spf-generator',
  },
};

export default function SPFGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
