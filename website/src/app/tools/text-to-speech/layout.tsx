import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text to Speech – Arabic, English, French, German | Sugesto',
  description:
    'Free AI text-to-speech tool supporting Arabic, English, French and German. Powered by facebook/mms-tts via HuggingFace. Generate audio instantly and download as WAV.',
  keywords: ['text to speech', 'TTS', 'Arabic TTS', 'French TTS', 'German TTS', 'HuggingFace MMS', 'free TTS online'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
