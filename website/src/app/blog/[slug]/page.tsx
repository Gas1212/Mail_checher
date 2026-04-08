import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getArticle, getArticleSlugs } from '@/lib/blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  const date = article.date
    ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{article.title}</span>
          </nav>

          {/* Category */}
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${article.categoryColor}`}>
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
            {date && <><span>·</span><time>{date}</time></>}
          </div>

          {/* Cover image */}
          {article.image && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg prose-indigo max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
