import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video Downloader - Download from YouTube, Twitter, Instagram | Sugesto',
  description: 'Free online video downloader. Download videos from YouTube, Twitter/X, Instagram, Facebook and 1000+ sites. No registration required.',
  keywords: ['video downloader', 'youtube downloader', 'instagram downloader', 'twitter video download', 'facebook video download'],
  openGraph: {
    title: 'Video Downloader - Sugesto Tools',
    description: 'Download videos from YouTube, Twitter, Instagram, Facebook and more. Free, fast, no sign-up.',
    url: 'https://sugesto.xyz/tools/video-downloader',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
