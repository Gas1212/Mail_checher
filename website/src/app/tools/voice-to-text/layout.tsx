import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice to Text – Speech Recognition Online | Sugesto',
  description:
    'Free AI speech-to-text tool powered by OpenAI Whisper Large V3. Upload an audio file and get accurate transcription in any language. Supports MP3, WAV, OGG, FLAC and more.',
  keywords: ['voice to text', 'speech to text', 'audio transcription', 'Whisper', 'free transcription', 'AI transcription', 'speech recognition'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
