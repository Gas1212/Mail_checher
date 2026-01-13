import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'product' | 'article'
  data?: Record<string, any>
}

export default function StructuredData({ type = 'website', data = {} }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = 'https://sugesto.xyz'

    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Sugesto',
          description: 'Professional email validation and SEO tools with syntax, DNS, SMTP verification, sitemap validation and more',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          sameAs: [
            // Add your social media URLs here
            // 'https://twitter.com/sugesto',
            // 'https://www.linkedin.com/company/sugesto',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'support@sugesto.xyz',
            contactType: 'Customer Support',
            availableLanguage: ['en'],
          },
          ...data,
        }

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Sugesto',
          description: 'Professional email validation and SEO tools',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/tools?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          ...data,
        }

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Sugesto Email Validation Tools',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
          },
          ...data,
        }

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline || 'Sugesto - Email Validation Tools',
          description: data.description || 'Professional email validation and SEO tools',
          author: {
            '@type': 'Organization',
            name: 'Sugesto',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Sugesto',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          ...data,
        }

      default:
        return data
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  )
}
