import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy – PricePortal DE | Sugesto',
  description: 'Privacy policy for the PricePortal DE Chrome extension. No personal data is collected or transmitted.',
  robots: { index: false },
}

export default function PricePortalPrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8 text-sm">PricePortal DE · Last updated: May 2025</p>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              This extension does not collect, store, transmit, or share any personal user data.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'No browsing history is recorded.',
                'No personal information is collected.',
                'Amazon.de cookies are used solely to make search requests to amazon.de on behalf of the user and are never stored or sent to any third party.',
                'User preferences (search method setting) are stored locally in chrome.storage.sync and never transmitted externally.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-gray-700">
              Contact:{' '}
              <a href="mailto:contact@sugesto.xyz" className="text-indigo-600 hover:underline">
                contact@sugesto.xyz
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
