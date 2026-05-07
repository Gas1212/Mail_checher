'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Upload, Download, ImageIcon, Loader2, ZoomIn } from 'lucide-react'
import ToolContent from '@/components/tools/ToolContent'

const API = process.env.NEXT_PUBLIC_API_URL

const MAX_SIZE_MB = 5
const ACCEPTED = 'image/jpeg,image/png,image/webp'

export default function ImageUpscalerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [sizeInfo, setSizeInfo] = useState<string>('')
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

  const handleUpscale = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API}/upscaler/upscale/`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upscaling failed. Please try again.')
      } else {
        setResult(`data:image/png;base64,${data.image}`)
        if (data.original_size && data.upscaled_size) {
          setSizeInfo(`${data.original_size} → ${data.upscaled_size}`)
        }
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
    a.download = `${file?.name.replace(/\.[^.]+$/, '') || 'image'}-4x-upscaled.png`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-4">
              <ZoomIn className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">LANCZOS + Sharpen · 4× Upscaling</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Image Upscaler</h1>
            <p className="text-gray-500 text-lg">Enhance and upscale images 4× with AI — free, no watermark</p>
          </div>

          {/* Upload zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !file && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition mb-6 bg-white ${file ? 'border-violet-200 cursor-default' : 'border-violet-200 cursor-pointer hover:bg-violet-50'}`}
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
                <Upload className="w-12 h-12 text-violet-300" />
                <p className="text-gray-600 font-medium">Drag & drop an image or click to browse</p>
                <p className="text-sm text-gray-400">JPEG, PNG, WebP · max {MAX_SIZE_MB} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-violet-400" />
                <p className="font-semibold text-gray-800">{file.name}</p>
                <button
                  onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                  className="text-xs text-violet-500 hover:text-violet-700 underline"
                >
                  Change image
                </button>
              </div>
            )}
          </div>

          {/* Upscale button */}
          {file && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleUpscale}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Upscaling… (may take up to 30s)
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-5 h-5" />
                    Upscale 4×
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
                    <span className="text-sm font-semibold text-gray-600">Upscaled 4× {sizeInfo && <span className="font-normal text-gray-400 text-xs">({sizeInfo})</span>}</span>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-center bg-gray-50 min-h-[250px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result} alt="Upscaled" className="max-h-64 max-w-full object-contain rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ToolContent
        schemaId="upscaler-faq"
        sections={[
          {
            h2: "How 4× Image Upscaling Works",
            content: "Our Image Upscaler uses LANCZOS resampling with Unsharp Masking post-processing — a high-quality, computationally efficient approach to image enlargement that has been the industry standard for professional photography and print workflows for decades. When you upload an image, it is processed server-side using Python's Pillow library with the LANCZOS (also known as Lanczos3) resampling filter.\n\nLANCZOS resampling is based on the sinc function windowed by the Lanczos kernel, a mathematical approach to signal reconstruction that minimizes aliasing (jagged edges) and ringing artifacts while preserving high-frequency detail better than simpler resampling methods like bilinear or bicubic. It works by calculating each output pixel as a weighted average of a large neighborhood of surrounding input pixels, with weights determined by the Lanczos kernel function.\n\nAfter enlargement, an Unsharp Mask is applied with carefully tuned parameters (radius 1, strength 80%, threshold 3 levels) to compensate for the slight softening that resampling introduces, restoring apparent sharpness and edge definition. The result is a 4× enlarged image that retains maximum detail from the original without AI hallucination artifacts.",
          },
          {
            h2: "Upscaling vs AI Super-Resolution",
            content: "LANCZOS upscaling and AI super-resolution (models like Real-ESRGAN, Swin2SR, or ESRGAN) represent two different approaches with distinct trade-offs. Traditional LANCZOS upscaling is deterministic — it mathematically enlarges existing pixels without adding information, producing consistent, predictable results with no possibility of introduced artifacts or hallucinated details. It is extremely fast, requires no GPU, and works identically on all image types.\n\nAI super-resolution models attempt to hallucinate plausible high-frequency details — generating texture, sharpness, and fine structure that wasn't present in the original. This can produce impressive results for certain image categories (faces, natural scenes, architecture) but may introduce artifacts, incorrect textures, or unwanted changes to image content. AI models also require significant GPU compute and can produce inconsistent results.\n\nFor product photography, document scanning, logo enlargement, and images where faithful reproduction of the original is critical, LANCZOS produces more reliable results. For artistic or photographic content where perceptual quality matters more than pixel-perfect fidelity, AI super-resolution can be preferable. Our tool prioritizes reliability and speed with LANCZOS + sharpening.",
          },
          {
            h2: "Use Cases and Output Quality",
            content: "4× upscaling is appropriate for a wide range of practical applications. Small product images from e-commerce platforms (often 500×500 px) can be enlarged to 2000×2000 px for print catalogs or large-format display. Profile photos from social media (typically 400×400 px) scale to 1600×1600 px for CV headers or presentation materials. Old photos scanned at low resolution can be enlarged for display or printing.\n\nThe output quality depends on the input image. Starting with a high-quality, sharp original produces the best results — LANCZOS preserves existing sharpness extremely well. Starting with a blurry, heavily compressed, or noisy image produces a larger version of those same defects. Upscaling cannot recover detail that wasn't captured in the original; it can only enlarge what is there.\n\nOutput images are provided as PNG files, using lossless compression that preserves all pixel values exactly. For images that will be further edited or composited, PNG is the correct format. For web delivery where file size matters more than lossless quality, you can convert the exported PNG to WebP or JPEG after downloading.",
          },
        ]}
        faqs={[
          {
            q: "How much larger does 4× upscaling make an image?",
            a: "4× upscaling multiplies both the width and height by 4, making the total pixel count 16× larger. A 500×500 image becomes 2000×2000. A 1000×750 image becomes 4000×3000. The file size increases proportionally — a small JPEG may become a large PNG of tens of megabytes, since the output is lossless PNG.",
          },
          {
            q: "What image formats can I upload?",
            a: "JPEG, PNG, and WebP images up to 5 MB are supported. All color modes (RGB, RGBA, greyscale) are handled. The output is always PNG for lossless quality preservation. If your source image is a JPEG with compression artifacts, those artifacts will be visible in the upscaled version — LANCZOS enlarges existing content faithfully, including existing defects.",
          },
          {
            q: "Is there a maximum input image size?",
            a: "Input images up to 5 MB are accepted. To prevent server overload, input images larger than 2000 pixels in either dimension are scaled down before upscaling, ensuring the output remains within manageable dimensions. For very high-resolution inputs, consider whether 4× enlargement is actually needed — a 2000×2000 px image upscaled to 8000×8000 px may be larger than most use cases require.",
          },
          {
            q: "How does LANCZOS compare to Photoshop's upscaling?",
            a: "Adobe Photoshop offers several resampling methods: Preserve Details 2.0 (AI-based), Bicubic Smoother, and Bicubic Sharper. Our LANCZOS + Unsharp Mask approach is most comparable to Photoshop's 'Bicubic Sharper' option, which is Photoshop's recommended method for enlargement followed by sharpening. For most practical upscaling tasks, results are visually equivalent to Photoshop's non-AI methods.",
          },
          {
            q: "Will upscaling fix a blurry photo?",
            a: "No. Upscaling enlarges existing pixels — it cannot recover information that was never captured. A blurry photo upscaled 4× becomes a larger blurry photo. The Unsharp Mask post-processing enhances perceived sharpness by increasing local contrast at edges, which can make a moderately soft image appear crisper, but it cannot deblur a genuinely out-of-focus or motion-blurred image.",
          },
        ]}
      />

      <Footer />
    </div>
  )
}
