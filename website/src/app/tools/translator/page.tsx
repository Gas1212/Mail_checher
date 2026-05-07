'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeftRight, Copy, Check, Languages } from 'lucide-react'
import ToolContent from '@/components/tools/ToolContent'

const API = process.env.NEXT_PUBLIC_API_URL

const LANGUAGES = [
  { key: 'arabic',     label: 'العربية',    flag: '🇸🇦', rtl: true },
  { key: 'english',    label: 'English',     flag: '🇬🇧', rtl: false },
  { key: 'french',     label: 'Français',    flag: '🇫🇷', rtl: false },
  { key: 'german',     label: 'Deutsch',     flag: '🇩🇪', rtl: false },
  { key: 'spanish',    label: 'Español',     flag: '🇪🇸', rtl: false },
  { key: 'italian',    label: 'Italiano',    flag: '🇮🇹', rtl: false },
  { key: 'portuguese', label: 'Português',   flag: '🇧🇷', rtl: false },
  { key: 'russian',    label: 'Русский',     flag: '🇷🇺', rtl: false },
  { key: 'chinese',    label: '中文',         flag: '🇨🇳', rtl: false },
  { key: 'japanese',   label: '日本語',       flag: '🇯🇵', rtl: false },
  { key: 'turkish',    label: 'Türkçe',      flag: '🇹🇷', rtl: false },
  { key: 'dutch',      label: 'Nederlands',  flag: '🇳🇱', rtl: false },
]

const MAX_CHARS = 1000

export default function TranslatorPage() {
  const [sourceKey, setSourceKey] = useState('english')
  const [targetKey, setTargetKey] = useState('french')
  const [inputText, setInputText] = useState('')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const sourceLang = LANGUAGES.find(l => l.key === sourceKey)!
  const targetLang = LANGUAGES.find(l => l.key === targetKey)!

  const handleSwap = () => {
    setSourceKey(targetKey)
    setTargetKey(sourceKey)
    setInputText(translation)
    setTranslation(inputText)
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setError('')
    setTranslation('')

    try {
      const res = await fetch(`${API}/translator/translate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, source_lang: sourceKey, target_lang: targetKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Translation failed. Please try again.')
      } else {
        setTranslation(data.translation || '')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!translation) return
    navigator.clipboard.writeText(translation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Languages className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Helsinki-NLP opus-mt · 12 Languages</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Multilingual Translator</h1>
            <p className="text-gray-500 text-lg">Translate text instantly with AI — free, no registration</p>
          </div>

          {/* Language selector bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
            <select
              value={sourceKey}
              onChange={e => setSourceKey(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LANGUAGES.map(l => (
                <option key={l.key} value={l.key}>{l.flag} {l.label}</option>
              ))}
            </select>

            <button
              onClick={handleSwap}
              title="Swap languages"
              className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>

            <select
              value={targetKey}
              onChange={e => setTargetKey(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LANGUAGES.map(l => (
                <option key={l.key} value={l.key}>{l.flag} {l.label}</option>
              ))}
            </select>
          </div>

          {/* Translation box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-600">{sourceLang.flag} {sourceLang.label}</span>
                <span className="text-xs text-gray-400">{inputText.length}/{MAX_CHARS}</span>
              </div>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Enter text to translate…"
                dir={sourceLang.rtl ? 'rtl' : 'ltr'}
                className="flex-1 resize-none p-4 text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none rounded-b-2xl min-h-[200px] text-base"
              />
            </div>

            {/* Target */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-blue-100">
                <span className="text-sm font-semibold text-blue-700">{targetLang.flag} {targetLang.label}</span>
                {translation && (
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div
                dir={targetLang.rtl ? 'rtl' : 'ltr'}
                className="flex-1 p-4 text-gray-800 text-base min-h-[200px] whitespace-pre-wrap"
              >
                {loading ? (
                  <span className="text-gray-400 animate-pulse">Translating…</span>
                ) : translation ? (
                  translation
                ) : (
                  <span className="text-gray-400">Translation will appear here</span>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Translate button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition shadow-md"
            >
              {loading ? 'Translating…' : 'Translate'}
            </button>
          </div>
        </div>
      </main>

      <ToolContent
        schemaId="translator-faq"
        sections={[
          {
            h2: "How the AI Translator Works",
            content: "Our translator is powered by Helsinki-NLP's opus-mt family of neural machine translation models, served via the HuggingFace Inference API. These are Marian NMT (Neural Machine Translation) models — compact, fast transformer-based models trained on OPUS, the world's largest collection of freely available parallel corpora covering millions of aligned sentence pairs across hundreds of language pairs.\n\nEach language pair uses a dedicated model (e.g. opus-mt-en-fr for English→French, opus-mt-ar-en for Arabic→English). When no direct model exists for a pair, the translator automatically pivots through English — translating source→English first, then English→target. This pivot approach covers rare language combinations while maintaining quality, since English is the most represented language in available training data.\n\nTranslation runs entirely server-side: your text is sent to the Django backend, which calls the appropriate HuggingFace model and returns the result. No text is stored after the response is delivered.",
          },
          {
            h2: "Supported Languages and Translation Quality",
            content: "The translator currently supports 12 languages: Arabic, English, French, German, Spanish, Italian, Portuguese, Russian, Chinese, Turkish, and Dutch. These languages were selected based on global speaker counts and the availability of high-quality opus-mt models for each pair.\n\nTranslation quality varies by language pair and text type. European language pairs (English↔French, English↔German, English↔Spanish) benefit from the largest training corpora and consistently produce high-quality output for general text. Arabic translation is more complex due to the language's rich morphology, root-pattern word formation, and right-to-left script — the tool displays Arabic output automatically in RTL direction.\n\nThe 1,000-character limit per request balances translation quality and API response time. For longer texts, splitting at paragraph or sentence boundaries produces better results than cutting mid-sentence, as the models process each request independently without cross-request context.",
          },
          {
            h2: "Neural Machine Translation vs Traditional Approaches",
            content: "Traditional rule-based and phrase-based statistical machine translation (SMT) systems required extensive manual linguistic knowledge and large phrase tables. Neural Machine Translation (NMT), introduced with the attention mechanism and Transformer architecture, fundamentally changed translation quality by learning representations directly from parallel text.\n\nThe Marian NMT framework used by Helsinki-NLP models implements the Transformer architecture with optimizations for speed and memory efficiency, making these models suitable for API deployment at scale. Unlike very large models such as Google's 1.2T-parameter PaLM or GPT-4 which handle translation as one of thousands of tasks, opus-mt models are specialized for translation, typically 74M–300M parameters, trained on billions of sentence pairs for specific language pairs.\n\nThis specialization means opus-mt models often outperform general-purpose LLMs on translation benchmarks for supported languages, while being significantly faster and cheaper to run — enabling free access without per-character pricing.",
          },
        ]}
        faqs={[
          {
            q: "Which languages can I translate between?",
            a: "The translator supports 12 languages: Arabic, English, French, German, Spanish, Italian, Portuguese, Russian, Chinese, Turkish, and Dutch. You can translate between any combination of these languages. When no direct translation model exists for a language pair, the system automatically routes through English as an intermediate language to complete the translation.",
          },
          {
            q: "How accurate is the AI translation?",
            a: "Translation accuracy is high for common language pairs involving European languages, particularly English↔French, English↔German, English↔Spanish, and English↔Italian. These pairs have the most training data available. Arabic translation quality is good for Modern Standard Arabic (MSA) but may struggle with colloquial dialects or highly specialized terminology. For critical content — legal documents, medical texts, formal communications — always have output reviewed by a native speaker.",
          },
          {
            q: "Is there a character limit for translation?",
            a: "Yes, the limit is 1,000 characters per translation request. For longer texts, translate paragraph by paragraph for the best results. Breaking text at natural sentence boundaries (periods, question marks) helps the model maintain proper context and produce more coherent translations than arbitrary cuts mid-sentence.",
          },
          {
            q: "Why does the swap button reverse the translation?",
            a: "The swap button exchanges both the selected languages and the text content — your original text moves to the source field and the translation becomes the new input. This lets you quickly back-translate (translate the output back to the original language) to verify accuracy, or continue translating in the reverse direction without retyping anything.",
          },
          {
            q: "Is my text kept private?",
            a: "Text sent for translation is processed in real time and is not stored after the response is returned. The translation request passes through our backend server to the HuggingFace API and the result is returned to your browser. No translation history is saved on our servers.",
          },
        ]}
      />

      <Footer />
    </div>
  )
}
