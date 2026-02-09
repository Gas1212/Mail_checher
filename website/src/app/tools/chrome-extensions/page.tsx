'use client';

import { Puzzle, ExternalLink, MessageSquare, Chrome, Search, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RelatedTools from '@/components/tools/RelatedTools';

export default function ChromeExtensionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Puzzle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Our Chrome Extensions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Discover our Chrome extensions built to boost your productivity with AI.
            </p>
          </div>

          {/* Extension: AI Comment Generator */}
          <a
            href="https://chromewebstore.google.com/detail/ai-comment-generator/jklndoeadnikdojcbhlknfmgmhiohbje"
            target="_blank"
            rel="noopener noreferrer"
            className="block group mb-8"
          >
            <Card hover className="border-2 border-indigo-100 group-hover:border-indigo-300 transition-all">
              <CardContent>
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/W_rCruQM34lUBAy2cIGE43d6Na4VGkLkuskYmNL0_M18ZtEGNZ8fVhuqHs-OFs2F86NNue1eFpvdHQ3Ajo7mrJbmbfk=s128"
                    alt="AI Comment Generator"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Comment Generator</h2>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">
                      Generate intelligent, context-aware responses for Quora comments with AI. Hover over any comment field, click the AI icon, and craft thoughtful replies instantly.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="success" className="text-xs">Free</Badge>
                      <Badge variant="info" className="text-xs">AI Powered</Badge>
                      <Badge variant="default" className="text-xs">Quora</Badge>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1.5">
                      <p className="flex items-start gap-2"><span className="text-indigo-500 font-medium">&#x2022;</span> Multiple AI providers: Gemini, Groq, OpenAI, Anthropic</p>
                      <p className="flex items-start gap-2"><span className="text-indigo-500 font-medium">&#x2022;</span> Customizable tone: Friendly, Professional, Humorous, Informative</p>
                      <p className="flex items-start gap-2"><span className="text-indigo-500 font-medium">&#x2022;</span> Multi-language: English, French, Spanish, German</p>
                      <p className="flex items-start gap-2"><span className="text-indigo-500 font-medium">&#x2022;</span> Privacy-first: API keys stored locally, no data collected</p>
                      <p className="flex items-start gap-2"><span className="text-indigo-500 font-medium">&#x2022;</span> Keyboard shortcut: Ctrl+Shift+G</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Chrome className="w-4 h-4" />
                    <span>Chrome Web Store</span>
                  </div>
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                    Install Free &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </main>

      <RelatedTools
        tools={[
          {
            name: 'Sitemap Validator',
            description: 'Validate your XML sitemaps',
            href: '/tools/sitemap-validator',
            icon: FileText,
            color: 'from-emerald-500 to-green-500',
          },
          {
            name: 'Sitemap Finder',
            description: 'Discover website sitemaps',
            href: '/tools/sitemap-finder',
            icon: Search,
            color: 'from-cyan-500 to-blue-500',
          },
          {
            name: 'All Tools',
            description: 'Explore our complete toolset',
            href: '/tools',
            icon: Puzzle,
            color: 'from-purple-500 to-pink-500',
          },
        ]}
      />

      <Footer />
    </>
  );
}
