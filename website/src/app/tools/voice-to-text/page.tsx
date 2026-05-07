'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mic, Upload, Copy, Check, FileAudio, Loader2 } from 'lucide-react'
import ToolContent from '@/components/tools/ToolContent'

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

      <ToolContent
        schemaId="stt-faq"
        sections={[
          {
            h2: "How AI Speech-to-Text Works with Whisper",
            content: "Our Voice to Text tool uses OpenAI's Whisper Large V3, one of the most capable open-source automatic speech recognition (ASR) models available. Whisper was trained by OpenAI on 680,000 hours of multilingual audio data collected from the internet, making it exceptionally robust to accents, background noise, technical jargon, and informal speech — conditions where earlier ASR systems struggled significantly.\n\nWhisper uses an encoder-decoder Transformer architecture. The audio is first converted to a log-Mel spectrogram (a frequency representation of sound over time), which the encoder processes to extract acoustic features. The decoder then autoregressively generates the transcript token by token, using attention to focus on the relevant audio segments for each word.\n\nWhen you upload a file, the audio bytes are sent directly to the HuggingFace Inference API running Whisper Large V3. The model transcribes the audio and returns the text. No audio data is stored after processing — the file is sent, transcribed, and the response returned to your browser.",
          },
          {
            h2: "Supported Audio Formats and Languages",
            content: "The tool accepts the most common audio formats: MP3 (audio/mpeg), WAV, OGG Vorbis, FLAC, M4A, and WebM — covering virtually all audio files you might encounter. The maximum file size is 10 MB, which corresponds to approximately 8–10 minutes of speech at typical MP3 bitrates (128 kbps).\n\nWhisper Large V3 supports transcription in 99 languages without requiring you to specify the language — it automatically detects the spoken language from the audio content. Supported languages include all major European languages, Arabic, Chinese (Mandarin), Japanese, Korean, Hindi, Turkish, and many more. Detection works reliably when at least 30 seconds of speech are present; very short clips may be misidentified.\n\nFor best results, use clear recordings with minimal background noise and one primary speaker. Whisper handles multiple speakers but does not distinguish between them (speaker diarization). Background music, overlapping speech, and very heavy accents can reduce accuracy, though Whisper is more resilient to these conditions than most competing models.",
          },
          {
            h2: "Accuracy, Limitations and Privacy",
            content: "Whisper Large V3 achieves state-of-the-art word error rates across most benchmark languages, often matching or approaching human-level accuracy for clear speech in well-supported languages. English achieves the lowest error rates given its dominance in training data. Languages with less internet audio representation — including many African and indigenous languages — may have higher error rates despite being technically supported.\n\nThe model performs punctuation and capitalization automatically, producing ready-to-use text without requiring manual formatting. Technical vocabulary, proper nouns, and domain-specific terms are generally handled well if they appear in the training data.\n\nPrivacy is maintained by design: your audio file is transmitted to the API for processing and the transcript is returned to your browser. No audio files are stored on our servers after processing. For highly sensitive recordings, consider the privacy policies of all services in the processing chain.",
          },
        ]}
        faqs={[
          {
            q: "What audio formats are supported for transcription?",
            a: "The tool supports MP3, WAV, OGG, FLAC, M4A, WebM, and most common audio formats. The maximum file size is 10 MB. For longer recordings, consider splitting the audio into segments. Files recorded at standard quality (44.1 kHz, 128 kbps or higher) produce the best transcription results.",
          },
          {
            q: "Which languages can Whisper transcribe?",
            a: "Whisper Large V3 supports 99 languages automatically detected from the audio content — you don't need to specify the language. This includes English, French, Arabic, Spanish, German, Chinese, Japanese, Portuguese, Russian, Italian, Korean, Turkish, Hindi, and many more. Accuracy is highest for languages with large amounts of audio training data, particularly English and major European languages.",
          },
          {
            q: "How accurate is the transcription?",
            a: "For clear speech recordings in well-supported languages, Whisper Large V3 achieves near-human accuracy. Word error rates for English are typically under 5% for clear studio recordings. Performance degrades with heavy background noise, strong accents, overlapping speakers, or very specialized technical vocabulary not in the training data. For professional-grade transcription of challenging audio, manual review is recommended.",
          },
          {
            q: "Why does transcription sometimes take a while?",
            a: "Transcription time depends on audio length and model availability. The Whisper Large V3 model has over 1.5 billion parameters and requires GPU resources to run — if the model hasn't been used recently, the first request may take 20–30 seconds for the model to load. Once warm, subsequent transcriptions are faster. Longer audio files naturally take more processing time than short clips.",
          },
          {
            q: "Is my audio file stored after transcription?",
            a: "No. Your audio file is sent to the transcription API, processed in real time, and the text is returned to your browser. We do not store audio files on our servers. The file exists in memory only for the duration of the API call and is discarded after the response.",
          },
        ]}
      />

      <Footer />
    </div>
  )
}
