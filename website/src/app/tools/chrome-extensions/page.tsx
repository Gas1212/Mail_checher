'use client';

import { Puzzle, ExternalLink, MessageSquare, Chrome, Search, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
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

      <ToolContent
        schemaId="chrome-extensions-faq"
        sections={[
          {
            h2: "Essential Chrome Extensions for SEO Professionals",
            content: "SEO analysis in the browser has become an indispensable part of modern search optimization workflows. Chrome extensions bring powerful SEO data directly into the browsing experience, eliminating the need to switch between tools and enabling instant analysis of any page you visit. From on-page element inspection to backlink data, SERP manipulation, and technical auditing, the right set of extensions transforms Chrome into a comprehensive SEO workstation.\n\nThe most impactful extensions for day-to-day SEO work fall into several categories: page analysis tools that expose meta tags, heading structure, and canonical URLs; link analysis tools that show domain authority and backlink metrics; SERP manipulation tools that reveal position tracking data; and technical tools for rendering JavaScript content, checking page speed, and auditing structured data.\n\nFor agencies and enterprise SEO teams, standardizing a core set of extensions across team members ensures consistent analysis methods and data sources. Extensions like Ahrefs SEO Toolbar, Moz Bar, or SEOquake provide link metrics and on-page data used in client reporting. Combined with technical tools like Web Developer and Lighthouse, a curated extension set covers the full spectrum of SEO analysis tasks.",
          },
          {
            h2: "On-Page SEO Analysis with Browser Extensions",
            content: "On-page SEO analysis is where browser extensions provide the most immediate value. Rather than viewing page source and manually identifying meta tags, extensions surface this information in a clean interface: title tag length with character count, meta description, canonical URL, robots meta directives, Open Graph tags, Twitter Card markup, and hreflang attributes for international SEO.\n\nHeading structure visualization is particularly valuable for content audits. Extensions that display the full heading hierarchy (H1 through H6) allow instant assessment of whether pages follow proper heading structure — a single H1 with nested subheadings versus multiple H1s, inconsistent hierarchy, or missing subheadings entirely. This analysis across dozens of pages in an audit is far faster with an extension than with any other method.\n\nLink analysis within the page context reveals internal linking patterns in real time. Seeing which pages receive the most internal links, identifying links marked nofollow, and checking anchor text distribution are tasks that on-page SEO extensions handle efficiently. Some extensions also integrate directly with backlink databases, overlaying domain authority scores on all links within the current page.",
          },
          {
            h2: "Technical SEO Extensions for Development and Auditing",
            content: "Technical SEO requires deeper analysis than on-page extensions typically provide. Dedicated technical extensions address rendering, structured data, and performance — areas that significantly impact search performance but are not visible in the standard browsing experience.\n\nSchema markup validation is a critical technical SEO task that browser extensions simplify enormously. Extensions like Schema Markup Validator visualize all structured data on a page, identify validation errors, and preview how rich results might appear in search results. This is essential for e-commerce sites implementing Product schema, publishers using Article markup, or local businesses with LocalBusiness structured data.\n\nPage speed and Core Web Vitals measurement is built into Chrome via Lighthouse in DevTools, but extensions make this data more accessible without opening developer tools. Extensions that measure Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint overlay performance scores directly on the page, making it easy to spot performance regressions as you navigate through a site during an audit.",
          },
        ]}
        faqs={[
          {
            q: "Which Chrome extension is best for checking SEO metrics quickly?",
            a: "For fast on-page SEO checks, the most popular options are Ahrefs SEO Toolbar (shows DR, UR, and backlink counts), Moz Bar (DA/PA scores and on-page elements), and SEOquake (comprehensive on-page data and SERP overlays). For technical analysis, Web Developer and the Schema Markup Validator are indispensable. Most professional SEOs use 3-5 extensions covering different aspects: link metrics, on-page data, and technical analysis.",
          },
          {
            q: "Do SEO Chrome extensions slow down browser performance?",
            a: "Yes, multiple active extensions can impact browser performance, particularly on resource-intensive pages. Extensions that inject scripts on every page load have the most impact. Best practice is to keep only actively used extensions enabled and disable others until needed. Chrome's built-in Extension Manager allows toggling extensions without uninstalling them. Maintaining separate Chrome profiles for SEO work, development, and general browsing helps manage extension overhead.",
          },
          {
            q: "Are browser extension SEO metrics accurate?",
            a: "Extension metrics are generally accurate for data sourced from reputable databases. Ahrefs, Moz, and Majestic extensions pull directly from their respective databases, providing the same data as their web interfaces. However, all third-party SEO metrics like Domain Authority and Domain Rating are proprietary approximations, not direct measurements. For definitive ranking and traffic data, Google Search Console is the authoritative source. Use extension metrics as comparative signals, not absolute measurements.",
          },
          {
            q: "Which extension helps with checking page indexing status?",
            a: "The Google Search Console integration in some SEO extensions shows indexing status directly in the browser. Alternatively, the site: search operator in Google reveals indexed pages. Extensions like SEOquake include a quick check-in-Google function. For bulk checking across multiple URLs, SEO crawling tools like Screaming Frog are more efficient than browser extensions, which work best for individual URL analysis during browsing.",
          },
          {
            q: "Can Chrome extensions help with local SEO analysis?",
            a: "Yes — several extensions specifically target local SEO analysis. Some extensions show Google Business Profile data in search results. MozBar displays local pack rankings alongside organic results. Extensions with schema validation help verify LocalBusiness structured data implementation. For checking NAP consistency across the web, browser extensions can speed up manual verification, though they are not a substitute for dedicated local SEO platforms that automate citation auditing at scale.",
          },
        ]}
      />
      <Footer />
    </>
  );
}
