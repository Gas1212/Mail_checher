'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  q: string
  a: string
}

interface Section {
  h2: string
  content: string  // supports \n\n for paragraph breaks
}

interface ToolContentProps {
  sections: Section[]
  faqs: FAQ[]
  schemaId?: string
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  )
}

export default function ToolContent({ sections, faqs, schemaId = 'faq-schema' }: ToolContentProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  return (
    <>
      {/* JSON-LD FAQ Schema */}
      <script
        id={schemaId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-white border-t border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Content Sections */}
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">{section.h2}</h2>
              <div className="space-y-4">
                {section.content.split('\n\n').map((para, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
