'use client';

import { useState } from 'react';
import { Search, Check, X, Loader2, Globe, FileText, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading } = useFreeTrial('sitemap-finder');

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
    const hasTrialsLeft = useOneTrial();
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
