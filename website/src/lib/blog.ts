const BLOG_API = process.env.NEXT_PUBLIC_API_URL || 'https://gas1911.serv00.net'

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  categoryColor: string
  image: string
  author: string
  readTime: number
  date: string
  amazonKeywords: string[]
  amazonProductUrl: string
  productNames: string[]
}

export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${BLOG_API}/api/blog/articles/`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  return res.json()
}

export async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${BLOG_API}/api/blog/articles/${slug}/`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getArticleSlugs(): Promise<string[]> {
  const res = await fetch(`${BLOG_API}/api/blog/slugs/`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  return res.json()
}
