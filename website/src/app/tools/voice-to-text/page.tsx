'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mic, Upload, Copy, Check, FileAudio, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

const MAX_SIZE_MB = 10
const ACCEPTED = 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/flac,audio/webm,audio/m4a,audio/mp4'

export default function VoiceToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum ${MAX_SIZE_MB} MB.`)
      return
    }
    setFile(f)
    setError('')
    setTranscript('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleTranscribe = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setTranscript('')

    const formData = new FormData()
    formData.append('audio', file)

    try {
      const res = await fetch(`${API}/stt/transcribe/`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Transcription failed. Please try again.')
      } else {
        setTranscript(data.text || '')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!transcript) return
    navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
              <Mic className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">OpenAI Whisper Large V3 · Any Language</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Voice to Text</h1>
            <p className="text-gray-500 text-lg">Upload an audio file and get an accurate transcript instantly</p>
          </div>

          {/* Drop zone */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center cursor-pointer hover:bg-indigo-50 transition mb-6 bg-white"
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileAudio className="w-12 h-12 text-indigo-500" />
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-xs text-indigo-500 mt-1">Click to change file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-indigo-300" />
                <p className="text-gray-600 font-medium">Drag & drop an audio file or click to browse</p>
                <p className="text-sm text-gray-400">MP3, WAV, OGG, FLAC, M4A, WebM · max {MAX_SIZE_MB} MB</p>
              </div>
            )}
          </div>

          {/* Transcribe button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleTranscribe}
              disabled={!file || loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transcribing…
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Transcribe
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Transcript output */}
          {transcript && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Transcript</span>
                <button onClick={handleCopy} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 text-gray-800 whitespace-pre-wrap leading-relaxed">{transcript}</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
