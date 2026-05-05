'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSites, addSite, addReview, type Site } from '@/lib/directory'
import { ExternalLink, Star, Plus, Globe, X, ChevronDown, ChevronUp } from 'lucide-react'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function StarDisplay({ rating, count }: { rating: number | null; count: number }) {
  const filled = rating ? Math.round(rating) : 0
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {rating ? `${rating}/5` : 'No reviews'} {count > 0 && `(${count})`}
      </span>
    </div>
  )
}

function SiteCard({ site, onReviewAdded }: { site: Site; onReviewAdded: (siteId: number, updated: Site) => void }) {
  const [showReviews, setShowReviews] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating'); return }
    setSubmitting(true)
    setError('')
    try {
      const review = await addReview(site.id, {
        rating,
        comment,
        author_name: authorName || 'Anonymous',
      })
      const updatedSite: Site = {
        ...site,
        reviews: [review, ...site.reviews].slice(0, 5),
        review_count: site.review_count + 1,
        avg_rating: site.avg_rating
          ? Math.round(((site.avg_rating * site.review_count + rating) / (site.review_count + 1)) * 10) / 10
          : rating,
      }
      onReviewAdded(site.id, updatedSite)
      setShowReviewForm(false)
      setRating(0)
      setComment('')
      setAuthorName('')
    } catch {
      setError('Failed to submit review. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      {site.image_url ? (
        <div className="h-40 overflow-hidden bg-gray-50">
          <img src={site.image_url} alt={site.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <Globe className="w-12 h-12 text-indigo-300" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name + link */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{site.name}</h3>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-indigo-600 hover:text-indigo-800 mt-0.5"
            title="Visit site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 flex-1">{site.description}</p>

        {/* Stars */}
        <StarDisplay rating={site.avg_rating} count={site.review_count} />

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex-1 text-sm font-medium bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 transition-colors"
          >
            {showReviewForm ? 'Cancel' : 'Leave a Review'}
          </button>
          {site.review_count > 0 && (
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              Reviews {showReviews ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Review form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="border-t pt-3 mt-1 flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Rating *</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Your name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Anonymous"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full text-sm font-medium bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        {showReviews && site.reviews.length > 0 && (
          <div className="border-t pt-3 mt-1 flex flex-col gap-3">
            {site.reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-800">{r.author_name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-xs text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DirectoryPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', url: '', description: '', image_url: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getSites()
    setSites(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSiteAdded = (siteId: number, updated: Site) => {
    setSites((prev) => prev.map((s) => (s.id === siteId ? updated : s)))
  }

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const newSite = await addSite({
        name: form.name,
        url: form.url,
        description: form.description,
        image_url: form.image_url || undefined,
      })
      setSites((prev) => [newSite, ...prev])
      setSuccess(true)
      setShowAddForm(false)
      setForm({ name: '', url: '', description: '', image_url: '' })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add site'
      try {
        const parsed = JSON.parse(message)
        if (parsed.url) setError('This URL is already in the directory.')
        else setError(Object.values(parsed).flat().join(' '))
      } catch {
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 pt-24 pb-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Web Directory</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Discover and share great websites. Submit yours and leave honest reviews — no sign-up required.
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold rounded-xl px-6 py-3 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showAddForm ? 'Cancel' : 'Add Your Website'}
            </button>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
          {/* Success banner */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
              <span>✓</span> Your website has been added successfully!
            </div>
          )}

          {/* Add Site Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-900">Submit a Website</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Site Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="My Awesome Website"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">URL *</label>
                  <input
                    required
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Description *</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What makes your website special?"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Image URL <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://example.com/screenshot.png"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm"
                  >
                    {submitting ? 'Submitting…' : 'Submit Website'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sites Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse" />
              ))}
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No websites yet. Be the first to submit!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} onReviewAdded={handleSiteAdded} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
