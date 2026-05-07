import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Upscaler – Free 4x AI Image Enhancer | Sugesto',
  description:
    'Upscale and enhance images 4x with AI. Powered by Swin2SR super-resolution. Upload any photo and download a high-resolution version — free, no registration.',
  keywords: ['image upscaler', 'AI upscaler', '4x upscale', 'super resolution', 'Swin2SR', 'enhance image', 'free image upscaler'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
