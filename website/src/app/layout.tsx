import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleTagManager, { GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sugesto - Professional Email Validation & SEO Tools',
  description: 'Professional email validation and SEO tools with syntax, DNS, SMTP verification, sitemap validation and more',
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
      </head>
      <body className={inter.className}>
        <GoogleTagManagerNoScript />
        {children}
      </body>
    </html>
  )
}
