'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Upload, Download, ImageIcon, Loader2, Scissors } from 'lucide-react'
import ToolContent from '@/components/tools/ToolContent'

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

    try {
      // Load from CDN — webpackIgnore prevents bundling (avoids WASM import.meta build errors)
      // eslint-disable-next-line
      const mod = await import(/* webpackIgnore: true */ 'https://esm.sh/@imgly/background-removal@1.7.0' as string)
      const removeBackground = (mod as { removeBackground: (input: File | Blob | string) => Promise<Blob> }).removeBackground
      const blob = await removeBackground(file)
      const url = URL.createObjectURL(blob)
      setResult(url)
    } catch (e) {
      console.error('Background removal error:', e)
      setError('Background removal failed. Please try again with a different image.')
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
              <span className="text-sm font-medium text-pink-600">BRIA RMBG-1.4 · Runs in your browser</span>
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
            <div className="flex flex-col items-center mb-8 gap-2">
              <button
                onClick={handleRemove}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing… (first run loads model)
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Remove Background
                  </>
                )}
              </button>
              {loading && (
                <p className="text-xs text-gray-400">Model runs in your browser — first use may take ~10s to load</p>
              )}
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
                  <div
                    className="p-4 flex items-center justify-center min-h-[250px]"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
                    }}
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

      <ToolContent
        schemaId="bgremover-faq"
        sections={[
          {
            h2: "How AI Background Removal Works",
            content: "Our Background Remover uses BRIA RMBG-1.4, a specialized image matting model developed by BRIA AI. Unlike earlier background removal approaches that relied on semantic segmentation (classifying each pixel as foreground or background based on object categories), RMBG-1.4 uses a hybrid architecture combining salient object detection with high-resolution detail preservation — enabling it to accurately separate fine details like hair strands, semi-transparent objects, and intricate edges from complex backgrounds.\n\nThe model runs entirely in your browser using ONNX Runtime Web, a WebAssembly-based inference engine. When you click 'Remove Background', the ONNX model weights are downloaded once (~80 MB) and cached in your browser — subsequent uses are instant. The image is processed locally on your device using your CPU and available GPU acceleration: no image data is ever sent to our servers, making this tool completely private.\n\nProcessing generates an alpha matte — a greyscale mask indicating pixel-by-pixel transparency — which is applied to the original image to produce a transparent PNG. The output preserves full original resolution and color accuracy.",
          },
          {
            h2: "Best Practices for Background Removal",
            content: "Background removal quality depends significantly on the input image characteristics. For optimal results: use images with clear contrast between the subject and background; ensure the subject is well-lit without harsh shadows blending into the background; use images of at least 500×500 pixels (higher resolution produces better edge detail); and prefer subjects with defined, non-transparent boundaries.\n\nThe model excels with product photography (items on plain backgrounds), portrait photography (person against any background), and food/object shots. It performs well with complex subjects including hair, fur, and fine clothing details. Images where the subject and background have similar colors, or images with very low contrast, may produce less accurate results.\n\nAfter removal, review the edges of your exported PNG. For professional use cases, zoom in to 100% to check for fringing (color contamination from the original background appearing at the edges) or missed areas in complex regions like hair. Most results are ready to use without further editing, particularly for common photography subjects.",
          },
          {
            h2: "Output Format and Usage",
            content: "Processed images are exported as PNG (Portable Network Graphics) with an alpha channel for transparency. PNG is the correct format for images requiring transparency — JPEG does not support alpha channels and would replace transparent areas with white. The exported file uses lossless compression, preserving every detail of the original image without encoding artifacts.\n\nThe transparent PNG can be used in any graphics application (Photoshop, Figma, Canva, GIMP), placed on any background in presentation software (PowerPoint, Keynote), used directly on websites with CSS backgrounds, or composited in video editing software. Transparent PNGs are the standard input format for most AI image generation and editing tools when you want to place a subject on a new background.\n\nAll processing happens locally in your browser — the model runs on your device using WebAssembly, and no image data leaves your computer. This means your images remain completely private, there are no usage limits, and processing speed depends only on your device's processing capability.",
          },
        ]}
        faqs={[
          {
            q: "Does background removal happen on my device or on a server?",
            a: "Entirely on your device. The BRIA RMBG-1.4 model runs in your browser using ONNX Runtime Web (WebAssembly). Your images are never uploaded to any server — processing happens locally on your CPU/GPU. The first use downloads the model weights (~80 MB) which are then cached in your browser for instant future use.",
          },
          {
            q: "What image formats are supported?",
            a: "JPEG, PNG, and WebP images up to 5 MB are supported. For best results, use images with at least 500×500 pixel resolution. The output is always a transparent PNG regardless of the input format, since PNG is the only common web format that supports transparency.",
          },
          {
            q: "Why does the first use take longer?",
            a: "The first time you use the tool, the browser downloads and caches the RMBG-1.4 ONNX model weights (~80 MB). This download happens once — subsequent uses load the cached model instantly. Processing time after loading depends on your device's CPU speed and image resolution, typically taking 2–10 seconds.",
          },
          {
            q: "What types of images work best?",
            a: "The tool works best on product photos (items on plain or studio backgrounds), portrait photos, food photography, and any subject with reasonably clear separation from the background. It handles fine details like hair and fur well. Images with very similar foreground and background colors, or subjects that blend into backgrounds, may produce less accurate results.",
          },
          {
            q: "Can I use the processed images commercially?",
            a: "Yes — the background removal processing itself adds no restrictions to your images. Your original image's copyright and licensing terms remain unchanged. The tool simply removes the background; you retain all rights to the resulting image that you had to the original.",
          },
        ]}
      />

      <Footer />
    </div>
  )
}
