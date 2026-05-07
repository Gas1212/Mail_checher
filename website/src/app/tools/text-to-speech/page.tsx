'use client'

import { useState, useRef } from 'react'
import { Volume2, Download, Loader2, RefreshCw, Mic, Play, Square } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ToolContent from '@/components/tools/ToolContent'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://gas1911.serv00.net/api'
const MAX_CHARS = 500

const LANGUAGES = [
  { id: 'english', label: 'English',  flag: '🇬🇧', dir: 'ltr', placeholder: 'Type your text here…' },
  { id: 'french',  label: 'Français', flag: '🇫🇷', dir: 'ltr', placeholder: 'Saisissez votre texte ici…' },
  { id: 'german',  label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr', placeholder: 'Geben Sie Ihren Text hier ein…' },
  { id: 'arabic',  label: 'العربية',  flag: '🇸🇦', dir: 'rtl', placeholder: 'اكتب نصك هنا…' },
]

type Status = 'idle' | 'loading' | 'done' | 'error' | 'retry'

export default function TextToSpeechPage() {
  const [lang, setLang] = useState(LANGUAGES[0])
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [audioFormat, setAudioFormat] = useState('wav')
  const [errorMsg, setErrorMsg] = useState('')
  const [retryAfter, setRetryAfter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentLang = LANGUAGES.find(l => l.id === lang.id) ?? LANGUAGES[0]

  async function generate() {
    if (!text.trim() || status === 'loading') return
    setStatus('loading')
    setAudioSrc(null)
    setErrorMsg('')

    try {
      const res = await fetch(`${API}/tts/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), language: lang.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 503 && data.retry_after) {
          setRetryAfter(data.retry_after)
          setStatus('retry')
          setErrorMsg(data.error || 'Model is loading, please wait…')
          return
        }
        setStatus('error')
        setErrorMsg(data.error || 'Failed to generate audio.')
        return
      }

      const blob = b64ToBlob(data.audio, `audio/${data.format}`)
      const url = URL.createObjectURL(blob)
      setAudioSrc(url)
      setAudioFormat(data.format)
      setStatus('done')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  function b64ToBlob(b64: string, mime: string): Blob {
    const binary = atob(b64)
    const buf = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i)
    return new Blob([buf], { type: mime })
  }

  function downloadAudio() {
    if (!audioSrc) return
    const a = document.createElement('a')
    a.href = audioSrc
    a.download = `tts-${lang.id}.${audioFormat}`
    a.click()
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  function handleLangChange(l: typeof LANGUAGES[0]) {
    setLang(l)
    setAudioSrc(null)
    setStatus('idle')
    setErrorMsg('')
  }

  const charsLeft = MAX_CHARS - text.length
  const canGenerate = text.trim().length > 0 && text.length <= MAX_CHARS && status !== 'loading'

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg mb-4">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Text to Speech</h1>
            <p className="text-gray-500 text-sm">
              Powered by <span className="font-medium text-purple-600">facebook/mms-tts</span> · Arabic · English · French · German
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleLangChange(l)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-sm font-medium
                      ${lang.id === l.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text to convert</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={currentLang.placeholder}
                dir={currentLang.dir}
                rows={5}
                maxLength={MAX_CHARS}
                className={`w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all
                  ${charsLeft < 50 ? 'border-orange-300' : 'border-gray-200'}
                  ${currentLang.dir === 'rtl' ? 'text-right font-arabic leading-loose' : ''}`}
              />
              <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                <span>{charsLeft < 50 && <span className="text-orange-500">{charsLeft} characters remaining</span>}</span>
                <span className={charsLeft < 0 ? 'text-red-500 font-medium' : ''}>{text.length}/{MAX_CHARS}</span>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!canGenerate}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all
                bg-gradient-to-r from-purple-500 to-indigo-600
                hover:from-purple-600 hover:to-indigo-700
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 shadow-md"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating audio…</>
              ) : (
                <><Volume2 className="w-5 h-5" /> Generate Audio</>
              )}
            </button>

            {/* Error */}
            {(status === 'error' || status === 'retry') && (
              <div className={`rounded-xl p-4 text-sm flex items-start gap-3
                ${status === 'retry' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status === 'retry' ? (
                  <RefreshCw className="w-5 h-5 mt-0.5 shrink-0" />
                ) : (
                  <span className="text-lg mt-0.5">⚠️</span>
                )}
                <div>
                  <p className="font-medium">{errorMsg}</p>
                  {status === 'retry' && (
                    <button
                      onClick={generate}
                      className="mt-2 text-amber-700 underline underline-offset-2 hover:text-amber-900"
                    >
                      Retry now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Audio player */}
            {status === 'done' && audioSrc && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                <audio
                  ref={audioRef}
                  src={audioSrc}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  {/* Play/pause */}
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-700 transition shrink-0"
                  >
                    {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Audio generated</p>
                    <p className="text-xs text-gray-400">{lang.flag} {lang.label} · {audioFormat.toUpperCase()}</p>
                    {/* Native browser audio bar */}
                    <audio
                      src={audioSrc}
                      controls
                      className="w-full mt-2 h-8"
                      style={{ accentColor: '#7c3aed' }}
                    />
                  </div>

                  {/* Download */}
                  <button
                    onClick={downloadAudio}
                    title="Download audio"
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-purple-200 text-purple-600 hover:bg-purple-100 transition shrink-0"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
            {[
              { icon: '✍️', title: 'Choose language', desc: 'Arabic, English, French or German' },
              { icon: '🤖', title: 'AI generates audio', desc: 'facebook/mms-tts via HuggingFace' },
              { icon: '🔊', title: 'Play & download', desc: 'Listen instantly, save as WAV' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="font-semibold text-gray-800">{s.title}</p>
                <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Voice-to-text note */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
            <Mic className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-indigo-800">Voice to Text coming soon</p>
              <p className="text-xs text-indigo-600 mt-0.5">
                Speech recognition (Arabic / EN / FR / DE) powered by OpenAI Whisper — in development.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ToolContent
        schemaId="tts-faq"
        sections={[
          {
            h2: "AI Text-to-Speech: How MMS-TTS Works",
            content: "Our Text-to-Speech tool is powered by Meta's Massively Multilingual Speech (MMS) project, specifically the mms-tts family of models published on HuggingFace. The MMS project trained lightweight VITS (Variational Inference with adversarial learning for end-to-end Text-to-Speech synthesis) models for over 1,100 languages, making high-quality TTS accessible in languages that were previously underserved by commercial TTS systems.\n\nVITS is an end-to-end TTS model that generates speech directly from text without intermediate mel-spectrogram prediction, resulting in natural-sounding synthesis with appropriate prosody, rhythm, and intonation. The MMS-TTS models are approximately 80MB per language, making them efficient for API deployment while maintaining high audio quality.\n\nEach language uses a dedicated model: mms-tts-ara for Arabic, mms-tts-eng for English, mms-tts-deu for German, and mms-tts-fra for French. These models are served via the HuggingFace Inference API, which handles model loading, scaling, and serving — your text is sent to the API and raw WAV audio is returned, which your browser plays immediately without any intermediate file storage.",
          },
          {
            h2: "Multilingual TTS: Arabic, English, French and German",
            content: "Supporting Arabic text-to-speech is one of the most technically challenging aspects of multilingual TTS. Arabic uses a right-to-left script, has complex morphology with root-pattern word formation, and features phonemes that don't exist in most other languages — including pharyngeal and uvular consonants. The MMS-TTS Arabic model (mms-tts-ara) was trained on native Arabic speech data, capturing these phonological features accurately without relying on romanization or transliteration.\n\nFor European languages — English, French, and German — the models handle language-specific phonetics effectively: French nasal vowels and liaison rules, German compound words and consonant clusters, and English's notoriously non-phonetic spelling. These are the languages where TTS technology has historically been most mature, and the MMS models perform comparably to commercial alternatives.\n\nThe tool accepts up to 500 characters per request. For longer texts, breaking content into natural sentence boundaries (paragraph by paragraph) produces better audio quality than cutting mid-sentence. The character limit balances audio quality, generation speed, and API rate limits for fair use across all users.",
          },
          {
            h2: "Use Cases for AI-Generated Speech",
            content: "Text-to-speech technology has evolved from a niche accessibility tool to a mainstream content creation technology used across industries. For content creators, TTS enables rapid audio production without recording studio costs — narrations for YouTube videos, podcast segments, social media audio content, and e-learning voiceovers can all be prototyped with AI-generated speech before committing to professional recording.\n\nAccessibility is another major use case. TTS makes written content accessible to users with dyslexia, visual impairments, or reading difficulties. Multilingual TTS enables content to reach audiences in their native language without hiring voice talent for each locale. Arabic TTS in particular opens content to over 300 million native Arabic speakers who benefit from hearing content in their language rather than consuming it in English.\n\nDevelopers use TTS APIs to add voice capabilities to applications: voice notifications, audio feedback in mobile apps, automated customer service systems, language learning applications (hearing correct pronunciation), and assistive technologies for accessibility. Our API endpoint makes it straightforward to integrate multilingual TTS into any web application.",
          },
        ]}
        faqs={[
          {
            q: "Which languages does the text-to-speech tool support?",
            a: "The tool currently supports four languages: Arabic (العربية), English, French (Français), and German (Deutsch). Each language uses a dedicated facebook/mms-tts model: mms-tts-ara, mms-tts-eng, mms-tts-fra, and mms-tts-deu respectively. Arabic is displayed right-to-left automatically in the text input. Additional languages may be added in future updates as the MMS model family covers 1,100+ languages.",
          },
          {
            q: "What is the maximum text length for TTS generation?",
            a: "The tool accepts up to 500 characters per generation request. For longer texts, we recommend splitting content into paragraphs or natural sentence groups and generating each segment separately. Shorter, focused sentences generally produce better-quality audio than very long complex sentences, as the model handles prosody and phrasing more naturally with clear sentence boundaries.",
          },
          {
            q: "What audio format does the generated speech use?",
            a: "Generated audio is returned in WAV format (Waveform Audio File Format), which is uncompressed and provides the highest audio quality without encoding artifacts. WAV files are universally compatible with all browsers, media players, and video editing software. You can download the generated WAV file directly using the download button and import it into any audio or video project.",
          },
          {
            q: "Why does audio generation sometimes take longer?",
            a: "Generation speed depends on two factors: model loading time and inference time. HuggingFace models have a warm-up period when they haven't been used recently — the first request after inactivity may take 20-30 seconds as the model loads into memory. Subsequent requests are much faster (typically 2-5 seconds). If you receive a 'model loading' message, wait the indicated time and retry. Longer texts also take slightly more time to synthesize than shorter ones.",
          },
          {
            q: "Can I use the generated audio commercially?",
            a: "The MMS-TTS models are released by Meta under CC-BY-NC 4.0 license (Attribution-NonCommercial), which permits personal, educational, and research use but not commercial use without separate licensing. For commercial applications requiring TTS in these languages, consider commercial TTS services that offer explicit commercial licensing. Always verify licensing requirements for your specific use case before using AI-generated content commercially.",
          },
        ]}
      />

      <Footer />
    </>
  )
}
