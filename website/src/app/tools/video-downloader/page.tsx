'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ToolContent from '@/components/tools/ToolContent'
import { Download, Loader2, AlertCircle, Music, Video, ExternalLink } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://gas1911.serv00.net/api'

interface VideoFormat {
  quality: string
  height: number
  ext: string
  url: string
  filesize: number | null
}

interface AudioFormat {
  url: string
  ext: string
}

interface VideoInfo {
  title: string
  thumbnail: string | null
  duration: string | null
  platform: string
  formats: VideoFormat[]
  audio: AudioFormat | null
}

const PLATFORM_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  youtube:     { label: 'YouTube',    color: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  twitter:     { label: 'Twitter/X',  color: 'text-sky-600',    bg: 'bg-sky-50 border-sky-200' },
  instagram:   { label: 'Instagram',  color: 'text-pink-600',   bg: 'bg-pink-50 border-pink-200' },
  facebook:    { label: 'Facebook',   color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
  tiktok:      { label: 'TikTok',     color: 'text-gray-900',   bg: 'bg-gray-50 border-gray-200' },
  vimeo:       { label: 'Vimeo',      color: 'text-cyan-600',   bg: 'bg-cyan-50 border-cyan-200' },
  dailymotion: { label: 'Dailymotion',color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  other:       { label: 'Video',      color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const SUPPORTED = [
  { name: 'YouTube', emoji: '▶️' },
  { name: 'Twitter/X', emoji: '🐦' },
  { name: 'Instagram', emoji: '📸' },
  { name: 'Facebook', emoji: '📘' },
  { name: 'TikTok', emoji: '🎵' },
  { name: 'Vimeo', emoji: '🎬' },
  { name: 'Dailymotion', emoji: '📺' },
  { name: '+1000 sites', emoji: '🌐' },
]

export default function VideoDownloaderPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [error, setError] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | AudioFormat | null>(null)
  const [isAudio, setIsAudio] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setInfo(null)
    setSelectedFormat(null)

    try {
      const res = await fetch(`${API}/downloader/info/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to extract video info')
        return
      }
      setInfo(data)
      // Pre-select best quality
      if (data.formats.length > 0) {
        setSelectedFormat(data.formats[0])
        setIsAudio(false)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!selectedFormat) return
    const downloadUrl = selectedFormat.url
    const a = document.createElement('a')
    a.href = downloadUrl
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }

  const platform = info?.platform || 'other'
  const pStyle = PLATFORM_STYLES[platform] || PLATFORM_STYLES.other

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 pt-24 pb-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
              <Download className="w-7 h-7 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Video Downloader</h1>
            <p className="text-lg text-gray-500 mb-8">
              Download videos from YouTube, Twitter, Instagram, Facebook and 1000+ more sites.
              No sign-up required.
            </p>

            {/* Supported platforms */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {SUPPORTED.map((p) => (
                <span key={p.name} className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  <span>{p.emoji}</span> {p.name}
                </span>
              ))}
            </div>

            {/* URL Input */}
            <form onSubmit={handleAnalyze} className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video URL here..."
                required
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="flex items-center gap-2 bg-red-600 text-white font-semibold rounded-xl px-5 py-3 hover:bg-red-700 disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>
            </form>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Video Info Card */}
          {info && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Thumbnail + meta */}
              <div className="flex gap-4 p-5 border-b border-gray-100">
                {info.thumbnail ? (
                  <img
                    src={info.thumbnail}
                    alt={info.title}
                    className="w-36 h-24 object-cover rounded-lg shrink-0 bg-gray-100"
                  />
                ) : (
                  <div className="w-36 h-24 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-2 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{info.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.color}`}>
                      {pStyle.label}
                    </span>
                    {info.duration && (
                      <span className="text-xs text-gray-500">{info.duration}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Format selector */}
              <div className="p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Choose quality:</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {info.formats.map((f) => {
                    const active = !isAudio && selectedFormat === f
                    return (
                      <button
                        key={f.quality}
                        onClick={() => { setSelectedFormat(f); setIsAudio(false) }}
                        className={`flex flex-col items-center px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                          active
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> {f.quality}</span>
                        {f.filesize && <span className={`text-xs mt-0.5 ${active ? 'text-red-100' : 'text-gray-400'}`}>{formatBytes(f.filesize)}</span>}
                      </button>
                    )
                  })}

                  {info.audio && (
                    <button
                      onClick={() => { setSelectedFormat(info.audio); setIsAudio(true) }}
                      className={`flex flex-col items-center px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        isAudio
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> Audio only</span>
                      <span className={`text-xs mt-0.5 ${isAudio ? 'text-red-100' : 'text-gray-400'}`}>{info.audio.ext.toUpperCase()}</span>
                    </button>
                  )}
                </div>

                {selectedFormat && (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold rounded-xl py-3 hover:bg-red-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download {isAudio ? 'Audio' : (selectedFormat as VideoFormat).quality}
                    {!isAudio && (selectedFormat as VideoFormat).filesize
                      ? ` (${formatBytes((selectedFormat as VideoFormat).filesize)})`
                      : ''}
                  </button>
                )}

                <p className="text-xs text-gray-400 text-center mt-3">
                  The video opens in a new tab — right-click → &quot;Save video as&quot; to save it.
                </p>
              </div>
            </div>
          )}

          {/* How it works */}
          {!info && !loading && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Paste URL', desc: 'Copy the video URL from any supported platform' },
                { step: '2', title: 'Choose quality', desc: 'Select the resolution or audio-only format' },
                { step: '3', title: 'Download', desc: 'Click download — no sign-up, no ads, free' },
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                  <div className="w-8 h-8 bg-red-50 text-red-600 font-bold text-sm rounded-full flex items-center justify-center mx-auto mb-2">{s.step}</div>
                  <p className="font-medium text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ToolContent
        schemaId="video-downloader-faq"
        sections={[
          {
            h2: "How the Video Downloader Works",
            content: "Our video downloader uses yt-dlp, the most widely maintained open-source video extraction library, to identify and surface direct download links from video hosting platforms. Rather than downloading videos to our server and then serving them to you — which would be slow, storage-intensive, and legally complex — our tool extracts the original video URLs that the platforms themselves serve to your browser during normal playback.\n\nThe process begins with URL analysis: the platform is identified from the URL structure, and the appropriate extractor handles the authentication and API calls needed to retrieve video metadata and stream URLs. The response includes the video title, thumbnail image, duration, available quality formats with file sizes, and for platforms that use separate audio/video streams, a combined stream option.\n\nDirect download links are provided to your browser, which then downloads the video directly from the platform's servers — not through ours. This architecture means download speeds are limited only by the platform's serving capacity and your connection speed. The download URL is time-limited by the platform and will expire — typically within a few hours, so downloading should happen promptly after retrieving the link.",
          },
          {
            h2: "Supported Platforms and Quality Options",
            content: "The yt-dlp library supports extraction from over 1,000 video hosting platforms and social media sites. Common platforms include YouTube, Twitter/X, Instagram, Facebook, Vimeo, Dailymotion, Reddit, TikTok, and many others. Platform support changes as sites update their APIs and authentication mechanisms — yt-dlp is actively maintained and typically updates quickly when platforms make changes.\n\nFor YouTube videos, quality options typically range from 144p to 4K (2160p), depending on what the uploader made available. Audio-only extraction is also supported, allowing you to save just the audio track from a video in M4A or WebM format. For platforms that serve combined streams (video and audio in a single file), quality options depend on what the platform provides — typically 360p, 480p, 720p, and 1080p for most social media video.\n\nSome platforms restrict access to content based on geographic region, account age, or monetization status. Age-restricted content, private videos, paid content, and DRM-protected streams cannot be downloaded without appropriate authentication. Our tool will return a descriptive error message when content restrictions prevent extraction, helping you understand why a specific video cannot be downloaded.",
          },
          {
            h2: "Legal Considerations for Video Downloading",
            content: "The legality of downloading online video varies by jurisdiction, platform terms of service, and intended use. Most video platforms' terms of service prohibit downloading video content without explicit permission from the platform or content creator. However, enforcement of these terms primarily targets commercial use cases and redistribution rather than personal use.\n\nCopyright law governs what you can do with downloaded content. Videos are typically protected by copyright held by the creator or a production company. Downloading for personal viewing may be tolerated in many jurisdictions, but redistribution, commercial use, or modification without permission infringes copyright regardless of how the video was obtained.\n\nFor content you have rights to — such as your own social media videos that you want to save, videos from Creative Commons licensed creators, public domain content, or videos where you have explicit permission from the copyright holder — downloading is unambiguously appropriate. Our tool is intended for these legitimate use cases. Always respect content creators' rights and platform terms of service when using video downloading tools.",
          },
        ]}
        faqs={[
          {
            q: "Which video platforms does the downloader support?",
            a: "The downloader supports over 1,000 platforms through the yt-dlp library, including YouTube, Twitter/X, Instagram (public posts), Facebook (public videos), Vimeo, Dailymotion, Reddit, and many more. Platform support is continuously maintained and updated. Some platforms require login authentication for private content or use DRM protection that prevents extraction. Public content on the listed major platforms works reliably for most videos.",
          },
          {
            q: "Why does the download link expire?",
            a: "Video platforms serve content using time-limited signed URLs that are generated at playback time and expire after a few hours. This is a security and monetization measure — platforms do not want you bookmarking direct video URLs for repeated access without loading their player, ads, and tracking. Our tool extracts the current valid URL, which you should download promptly. If a link expires before you download, simply re-run the tool with the same video URL to get a fresh download link.",
          },
          {
            q: "Can I download private or age-restricted videos?",
            a: "Private videos, age-restricted content requiring login, paid content, and DRM-protected streams cannot be downloaded without appropriate authentication credentials. Our tool extracts public video content that any viewer can access without logging in. Private Instagram posts, Facebook friends-only videos, and similar private content are not accessible without account credentials, which we do not collect.",
          },
          {
            q: "What video quality options are available for download?",
            a: "Available quality options depend on what the video uploader made available and the platform's capabilities. YouTube videos typically offer 144p, 240p, 360p, 480p, 720p, 1080p, and sometimes 1440p or 4K. Social media platforms like Twitter and Instagram usually offer fewer quality options, typically up to 720p or 1080p. Our tool displays all available quality options and file sizes so you can choose based on your storage and quality preferences.",
          },
          {
            q: "Is it legal to download YouTube videos?",
            a: "YouTube's Terms of Service prohibit downloading videos without YouTube's explicit permission, which is granted only through YouTube Premium's offline download feature. For content you have rights to — your own uploads, Creative Commons videos, or public domain content — downloading is legally straightforward. For copyrighted content not licensed for download, downloading for personal viewing is a legal grey area that varies by jurisdiction. Redistribution or commercial use of downloaded content without rights is copyright infringement regardless of jurisdiction.",
          },
        ]}
      />
      <Footer />
    </>
  )
}
