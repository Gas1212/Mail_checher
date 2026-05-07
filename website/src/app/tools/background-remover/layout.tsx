import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Background Remover – Free AI Image Background Removal | Sugesto',
  description:
    'Remove image backgrounds instantly with AI. Powered by BRIA RMBG-1.4. Upload any photo and download a transparent PNG — free, no registration, no watermark.',
  keywords: ['background remover', 'remove background', 'transparent PNG', 'AI background removal', 'RMBG', 'free background remover'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
