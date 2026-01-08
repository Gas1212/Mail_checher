import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Sugesto team. We are here to help with your email validation and SEO tool needs. Contact us for support, questions, or feedback.',
  keywords: ['contact', 'support', 'customer service', 'email support', 'get in touch', 'help'],
  openGraph: {
    title: 'Contact Us - Sugesto',
    description: 'Get in touch with the Sugesto team. We are here to help with your email validation and SEO tool needs.',
    url: 'https://sugesto.xyz/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Sugesto',
    description: 'Get in touch with the Sugesto team.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
