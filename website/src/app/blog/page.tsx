import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getArticles } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, guides and news about email validation, SEO tools and productivity.',
  alternates: { canonical: 'https://sugesto.xyz/blog' },
}

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tips, guides and insights about email validation, SEO tools and productivity.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                >
                  {article.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${article.categoryColor}`}>
                      {article.category}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{article.author}</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
