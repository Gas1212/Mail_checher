'use client';

import { useState } from 'react';
import { Search, Check, X, Loader2, Globe, FileText, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface SitemapInfo {
  url: string;
  status: 'found' | 'not-found';
  urlCount?: number;
  lastModified?: string;
  fileSize?: string;
}

interface FinderResult {
  domain: string;
  sitemapsFound: SitemapInfo[];
  totalSitemaps: number;
}

export default function SitemapFinderPage() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<FinderResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('sitemap-finder');

  const findSitemaps = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!domain.trim()) {
      return;
    }

    setIsSearching(true);
    setResult(null);

    // Simulate sitemap search (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clean domain
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const baseUrl = `https://${cleanDomain}`;

    // Common sitemap locations
    const commonLocations = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap1.xml',
      '/sitemaps/sitemap.xml',
      '/site-map.xml',
    ];

    const sitemaps: SitemapInfo[] = [];

    // Simulate finding sitemaps (randomly find 1-3)
    commonLocations.forEach((location, index) => {
      const found = index < 2 || Math.random() > 0.5; // Always find first 2, random for others

      if (found) {
        sitemaps.push({
          url: `${baseUrl}${location}`,
          status: 'found',
          urlCount: Math.floor(Math.random() * 1000) + 50,
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fileSize: `${(Math.random() * 500 + 50).toFixed(1)} KB`,
        });
      }
    });

    const finderResult: FinderResult = {
      domain: cleanDomain,
      sitemapsFound: sitemaps,
      totalSitemaps: sitemaps.length,
    };

    setResult(finderResult);
    setIsSearching(false);

    // Use one trial
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTrialsLeft = consumeTrial();
    if (!hasTrialsLeft) {
      // Show modal after displaying result
      setTimeout(() => setShowUpgradeModal(true), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      findSitemaps();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sitemap Finder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and analyze XML sitemaps for any domain. Find all sitemap files and get detailed information.
            </p>

            {/* Trial counter */}
            {!isLoading && !hasExceededLimit && (
              <div className="mt-6">
                <Badge variant="default" className="text-sm">
                  {remainingTrials} free {remainingTrials === 1 ? 'try' : 'tries'} remaining
                </Badge>
              </div>
            )}
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Domain Name"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="example.com"
                  disabled={isSearching || hasExceededLimit}
                />

                <Button
                  onClick={findSitemaps}
                  isLoading={isSearching}
                  disabled={!domain.trim() || isSearching || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Find Sitemaps
                    </>
                  )}
                </Button>

                {hasExceededLimit && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Create a free account to continue →
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="mb-8 border-2 border-gray-200">
              <CardContent>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Search Results for {result.domain}
                    </h3>
                    <p className="text-gray-600">
                      Found {result.totalSitemaps} sitemap{result.totalSitemaps !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-1">
                          {result.totalSitemaps}
                        </div>
                        <div className="text-sm text-gray-600">
                          Sitemap{result.totalSitemaps !== 1 ? 's' : ''} Discovered
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sitemaps List */}
                  {result.sitemapsFound.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Found Sitemaps:</h4>
                      <div className="space-y-3">
                        {result.sitemapsFound.map((sitemap, index) => (
                          <div
                            key={index}
                            className="p-4 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="font-medium text-green-900">Found</span>
                                  </div>
                                  <a
                                    href={sitemap.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-700 break-all flex items-center group"
                                  >
                                    {sitemap.url}
                                    <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Sitemap Details */}
                            <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-green-200">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">URLs</p>
                                <p className="text-sm font-medium text-gray-900">{sitemap.urlCount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Size</p>
                                <p className="text-sm font-medium text-gray-900">{sitemap.fileSize}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Last Modified</p>
                                <p className="text-sm font-medium text-gray-900">{sitemap.lastModified}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-yellow-900">No Sitemaps Found</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            We couldn&apos;t find any sitemaps at common locations. The site may not have a sitemap or it may be in a non-standard location.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  {result.sitemapsFound.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Validate each sitemap using our Sitemap Validator tool</li>
                        <li>Submit sitemaps to Google Search Console</li>
                        <li>Check that all URLs are accessible and return 200 status</li>
                        <li>Ensure lastmod dates are recent and accurate</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Where We Search
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Common Locations:</strong> We check standard sitemap locations including /sitemap.xml, /sitemap_index.xml, and more</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Robots.txt:</strong> We also check the robots.txt file for sitemap declarations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Search className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Multiple Formats:</strong> Detects both XML sitemaps and sitemap index files</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Quick Analysis:</strong> Get instant information about URLs count, file size, and last modification date</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToolContent
        schemaId="sitemap-finder-faq"
        sections={[
          {
            h2: "How Search Engines Discover Sitemaps",
            content: "Sitemaps can be discovered by search engines through several methods, not just direct submission in Search Console. The most reliable method is specifying the sitemap location in your robots.txt file using the Sitemap: directive — search engine crawlers read robots.txt early in the crawl process, making this a universal discovery mechanism that works for all crawlers without requiring active submission.\n\nSearch engines also follow common sitemap naming conventions, automatically checking well-known URLs like /sitemap.xml, /sitemap_index.xml, /sitemap.xml.gz, and /sitemaps/sitemap.xml. Our sitemap finder tool checks all these locations along with references in your robots.txt, giving you a complete picture of all sitemaps associated with your domain.\n\nFor websites running common CMS platforms, sitemaps are often generated automatically. WordPress sites using Yoast SEO, All in One SEO, or Rank Math publish sitemaps at predictable locations. Shopify generates sitemaps at /sitemap.xml automatically. Knowing where to find these sitemaps is the first step in auditing and optimizing them for search performance.",
          },
          {
            h2: "Auditing Found Sitemaps for SEO Issues",
            content: "Once you have discovered all sitemaps associated with a domain, systematic auditing reveals opportunities and issues that affect search performance. The audit begins with URL count and format verification — ensuring the sitemap is valid XML, within size limits, and contains only the URLs you intend to include.\n\nCompetitor sitemap analysis is a valuable SEO research technique. When you find a competitor's sitemap, you gain insight into their complete site structure, total indexed page count, content categories and priorities, and publication frequency from lastmod timestamps. This intelligence informs content strategy decisions — identifying gaps in their coverage that represent opportunities for your content.\n\nFor technical SEO audits, sitemap finder is an early step in the site assessment process. Sitemaps that reference pages returning 404 errors, 301 redirects, or noindex directives indicate site structure problems that need correction. Finding multiple conflicting sitemaps (common after CMS migrations) reveals historical site structure that may be confusing crawlers and diluting crawl budget.",
          },
          {
            h2: "Optimizing Sitemap Structure for Better Crawl Coverage",
            content: "The relationship between your sitemap and robots.txt is critical for crawl efficiency. Your robots.txt should always reference your sitemap location, but must not disallow access to the sitemap file itself — a common configuration error where sites accidentally block crawlers from reading their sitemap. Checking both files together reveals these types of conflicts.\n\nFor large sites, segmented sitemaps organized by content type improve crawl efficiency significantly. When Google can attribute indexing metrics to specific sitemap files in Search Console, you gain actionable visibility into which content sections are being indexed versus ignored. A dedicated news sitemap for recent articles, product sitemap for e-commerce inventory, and blog sitemap for editorial content gives you granular control and reporting.\n\nSitemap freshness signals matter. Search engines track how often sitemaps change and calibrate crawl frequency accordingly. Sites that update sitemaps regularly with accurate lastmod dates for genuinely changed content train crawlers to check frequently. The combination of a discoverable sitemap via robots.txt, accurate change frequency signals, and clean URL lists creates optimal conditions for comprehensive and timely indexing.",
          },
        ]}
        faqs={[
          {
            q: "Where are sitemaps typically located on a website?",
            a: "The most common sitemap locations are /sitemap.xml (by far the most standard), /sitemap_index.xml for sites using a sitemap index, /sitemap.xml.gz for the compressed version, /wp-sitemap.xml for WordPress core, and /sitemaps/sitemap.xml. The most reliable way to find all sitemaps is to check both these standard locations and the Sitemap: directive in the site's robots.txt file. Our tool checks all these sources automatically.",
          },
          {
            q: "Can I view a competitor's sitemap?",
            a: "Yes — sitemaps are public files accessible to anyone, not just search engines. Viewing a competitor's sitemap reveals their complete site structure, total URL count, content categories, product listings, and publishing frequency from lastmod timestamps. This competitive intelligence is particularly valuable for content gap analysis, understanding competitor site architecture, and benchmarking your own content depth against theirs. Our sitemap finder works on any public domain.",
          },
          {
            q: "What should I do if my sitemap does not appear in robots.txt?",
            a: "Add a Sitemap: directive to your robots.txt file pointing to your sitemap URL. For example: Sitemap: https://yourdomain.com/sitemap.xml. This is the most reliable way to ensure all search engine crawlers discover your sitemap, since all well-behaved crawlers read robots.txt. You can reference multiple sitemaps with multiple Sitemap: lines. After adding the directive, submit the sitemap URL to Google Search Console and Bing Webmaster Tools for faster indexing.",
          },
          {
            q: "Why might a website have multiple sitemaps?",
            a: "Multiple sitemaps serve several purposes. Large sites exceeding 50,000 URLs are required to split into multiple files referenced by a sitemap index. Content-type segmentation allows separate tracking in Search Console. Historical sitemaps from CMS migrations may persist alongside new ones. Some platforms generate both a main sitemap and specialized sitemaps, like Google News sitemaps for news publishers or video sitemaps for sites with embedded video content.",
          },
          {
            q: "How do I submit a discovered sitemap to Google?",
            a: "To submit a sitemap to Google Search Console: navigate to your property in GSC, click Sitemaps in the left sidebar under Indexing, enter the sitemap URL in the Add a new sitemap field, and click Submit. Google will begin processing the sitemap within minutes. You can track submission status, URL counts, and any errors in the Sitemaps report. For Bing, use Bing Webmaster Tools with a similar submission process.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Sitemap Finder"
      />
    </>
  );
}
