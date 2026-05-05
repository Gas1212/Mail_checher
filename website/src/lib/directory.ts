const API = process.env.NEXT_PUBLIC_API_URL || 'https://gas1911.serv00.net/api'

export interface Review {
  id: number
  rating: number
  comment: string
  author_name: string
  created_at: string
}

export interface Site {
  id: number
  name: string
  url: string
  description: string
  image_url: string
  created_at: string
  avg_rating: number | null
  review_count: number
  reviews: Review[]
}

export async function getSites(): Promise<Site[]> {
  try {
    const res = await fetch(`${API}/directory/sites/`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function addSite(data: {
  name: string
  url: string
  description: string
  image_url?: string
}): Promise<Site> {
  const res = await fetch(`${API}/directory/sites/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}

export async function addReview(
  siteId: number,
  data: { rating: number; comment?: string; author_name?: string }
): Promise<Review> {
  const res = await fetch(`${API}/directory/sites/${siteId}/reviews/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}
