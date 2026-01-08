import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleTagManager, { GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'
import StructuredData from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://sugesto.xyz'),
  title: {
    default: 'Sugesto - Professional Email Validation & SEO Tools',
    template: '%s - Sugesto',
  },
  description: 'Professional email validation and SEO tools with syntax, DNS, SMTP verification, sitemap validation and more',
  keywords: ['email validation', 'email checker', 'SMTP verification', 'DNS lookup', 'SEO tools', 'sitemap validator'],
  authors: [{ name: 'Sugesto' }],
  creator: 'Sugesto',
  publisher: 'Sugesto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sugesto.xyz',
    siteName: 'Sugesto',
    title: 'Sugesto - Professional Email Validation & SEO Tools',
    description: 'Professional email validation and SEO tools with syntax, DNS, SMTP verification, sitemap validation and more',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sugesto - Professional Email Validation & SEO Tools',
    description: 'Professional email validation and SEO tools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sugesto.xyz',
    languages: {
      'en-US': 'https://sugesto.xyz',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
        <link rel="canonical" href="https://sugesto.xyz" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body className={inter.className}>
        <GoogleTagManagerNoScript />
        <StructuredData type="website" />
        <StructuredData type="organization" />
        {children}
      </body>
    </html>
  )
}
