import { MetadataRoute } from 'next'

const BASE_URL = 'https://sugesto.xyz'
const BLOG_API = 'https://gas1911.serv00.net'

async function getBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${BLOG_API}/api/blog/slugs/`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contact`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`,                     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/tools`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/email-checker`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/bulk-checker`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/mx-lookup`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/list-cleaner`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/role-detector`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/spf-generator`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/blacklist-checker`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/sitemap-validator`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/sitemap-finder`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tools/content-generator`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
  ]

  const slugs = await getBlogSlugs()
  const blogPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}
