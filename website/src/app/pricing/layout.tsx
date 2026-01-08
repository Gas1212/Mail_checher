import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans',
  description: 'Choose the perfect plan for your email validation needs. Free tier available with premium features for power users. Flexible pricing for businesses of all sizes.',
  keywords: ['pricing', 'email validation pricing', 'email checker plans', 'subscription', 'free email validation', 'premium plans'],
  openGraph: {
    title: 'Pricing Plans - Sugesto',
    description: 'Choose the perfect plan for your email validation needs. Free tier available with premium features for power users.',
    url: 'https://sugesto.xyz/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - Sugesto',
    description: 'Choose the perfect plan for your email validation needs.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
