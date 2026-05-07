import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multilingual Translator – Arabic, English, French, German & More | Sugesto',
  description:
    'Free AI translator powered by Meta NLLB-200. Translate text between Arabic, English, French, German, Spanish, Italian, Portuguese, Russian, Chinese, Japanese and more. Instant, accurate translations.',
  keywords: ['translator', 'free translator', 'Arabic translator', 'NLLB translator', 'multilingual translation', 'AI translation', 'translate text online'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
