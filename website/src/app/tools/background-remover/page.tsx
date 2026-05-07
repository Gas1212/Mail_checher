'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Upload, Download, ImageIcon, Loader2, Scissors } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

const MAX_SIZE_MB = 5
const ACCEPTED = 'image/jpeg,image/png,image/webp'

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum ${MAX_SIZE_MB} MB.`)
      return
    }
    setFile(f)
    setError('')
    setResult('')
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleRemove = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API}/bgremover/remove/`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Background removal failed. Please try again.')
      } else {
        setResult(`data:image/png;base64,${data.image}`)
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = `${file?.name.replace(/\.[^.]+$/, '') || 'image'}-no-bg.png`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full mb-4">
              <Scissors className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-600">BRIA RMBG-1.4 · Free, No Watermark</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Background Remover</h1>
            <p className="text-gray-500 text-lg">Remove backgrounds with AI — get a transparent PNG instantly</p>
          </div>

          {/* Upload zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !file && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition mb-6 bg-white ${file ? 'border-pink-200 cursor-default' : 'border-pink-200 cursor-pointer hover:bg-pink-50'}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />
            {!file ? (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-pink-300" />
                <p className="text-gray-600 font-medium">Drag & drop an image or click to browse</p>
                <p className="text-sm text-gray-400">JPEG, PNG, WebP · max {MAX_SIZE_MB} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-pink-400" />
                <p className="font-semibold text-gray-800">{file.name}</p>
                <button
                  onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                  className="text-xs text-pink-500 hover:text-pink-700 underline"
                >
                  Change image
                </button>
              </div>
            )}
          </div>

          {/* Remove button */}
          {file && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleRemove}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Remove Background
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Before / After preview */}
          {(preview || result) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preview && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-600">Original</div>
                  <div className="p-4 flex items-center justify-center bg-gray-50 min-h-[250px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Original" className="max-h-64 max-w-full object-contain rounded" />
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-600">Background Removed</span>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 text-xs font-medium text-pink-600 hover:text-pink-800 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-center min-h-[250px]"
                    style={{ backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result} alt="Background removed" className="max-h-64 max-w-full object-contain rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
