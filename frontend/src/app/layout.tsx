import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleOAuthProvider from '@/components/providers/GoogleOAuthProvider'

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
      <body className={inter.className}>
        <GoogleOAuthProvider>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
