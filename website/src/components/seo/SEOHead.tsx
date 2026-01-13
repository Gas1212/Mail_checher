import { Metadata } from 'next'

interface SEOMetadata {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  keywords?: string[]
  noindex?: boolean
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  ogImage = '/og-image.png',
  ogType = 'website',
  keywords = [],
  noindex = false,
  author = 'Sugesto',
  publishedTime,
  modifiedTime,
}: SEOMetadata): Metadata {
  const baseUrl = 'https://sugesto.xyz'
  const fullTitle = title.includes('Sugesto') ? title : `${title} - Sugesto`
  const canonicalUrl = canonical || baseUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    authors: [{ name: author }],
    creator: author,
    publisher: 'Sugesto',

    // Keywords
    keywords: [
      'email validation',
      'email checker',
      'SMTP verification',
      'DNS lookup',
      'MX records',
      'bulk email validator',
      'SEO tools',
      'sitemap validator',
      ...keywords,
    ],

    // Robots
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },

    // Open Graph
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Sugesto',
      locale: 'en_US',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: '@sugesto', // Replace with actual Twitter handle
      site: '@sugesto',
    },

    // Additional Meta Tags
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': canonicalUrl,
      },
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      // yandex: 'yandex-verification-code',
      // bing: 'bing-verification-code',
    },

    // Manifest
    manifest: '/manifest.json',

    // Icons
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },

    // Other
    category: 'Technology',
  }

  return metadata
}

// Predefined metadata for common pages
export const homeMetadata = generateSEOMetadata({
  title: 'Sugesto - Professional Email Validation & SEO Tools',
  description: 'Validate emails with syntax, DNS, MX, and SMTP checks. Bulk email validation, sitemap tools, SPF generator, and blacklist checker. Fast, accurate, and reliable.',
  keywords: ['email validation tool', 'bulk email checker', 'email verifier', 'SMTP validator'],
})

export const aboutMetadata = generateSEOMetadata({
  title: 'About Sugesto',
  description: 'Learn about Sugesto, our mission to provide reliable email validation and SEO tools for businesses and developers worldwide.',
})

export const pricingMetadata = generateSEOMetadata({
  title: 'Pricing Plans',
  description: 'Choose the perfect plan for your email validation needs. Free tier available with premium features for power users.',
})

export const contactMetadata = generateSEOMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the Sugesto team. We are here to help with your email validation and SEO tool needs.',
})

export const toolsMetadata = generateSEOMetadata({
  title: 'Email & SEO Tools',
  description: 'Explore our comprehensive suite of email validation and SEO tools including email checker, bulk validator, sitemap tools, and more.',
  keywords: ['email tools', 'SEO tools', 'validation tools', 'webmaster tools'],
})
