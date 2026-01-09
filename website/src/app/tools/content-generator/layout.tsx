import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Content Generator - Create Marketing Content with AI',
  description: 'Free AI-powered content generator for marketing. Create product titles, meta descriptions, social media posts (LinkedIn, Facebook, Instagram, TikTok), and email content. Try 3 times for free.',
  keywords: ['ai content generator', 'marketing content', 'product description generator', 'social media post generator', 'email content generator', 'ai copywriting', 'content creation tool'],
  openGraph: {
    title: 'AI Content Generator - Sugesto',
    description: 'Generate professional marketing content with AI. Product descriptions, social posts, and email content in seconds.',
    url: 'https://sugesto.xyz/tools/content-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Generator - Sugesto',
    description: 'Create marketing content with AI - product descriptions, social posts, emails.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/content-generator',
  },
};

export default function ContentGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
