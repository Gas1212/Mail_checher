import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleOAuthProvider from '@/components/providers/GoogleOAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Email Checker - Validate Email Addresses',
  description: 'Professional email validation tool with syntax, DNS, SMTP verification and disposable email detection',
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
