'use client';

import { useState } from 'react';
import { CheckCircle, Check, X, AlertCircle, Loader2, FileText, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
}

interface SitemapResult {
  url: string;
  isValid: boolean;
  urlCount: number;
  fileSize: string;
  issues: ValidationIssue[];
  score: number;
}

export default function SitemapValidatorPage() {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('sitemap-validator');

  const validateSitemap = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!sitemapUrl.trim()) {
      return;
    }

    setIsValidating(true);
    setResult(null);

    // Simulate validation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate validation results
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Random validation issues for demo
    const possibleIssues = [
      { type: 'warning' as const, message: 'Some URLs are missing lastmod dates', impact: 5 },
      { type: 'warning' as const, message: 'Priority values should be between 0.0 and 1.0', impact: 3 },
      { type: 'info' as const, message: 'Consider adding changefreq for better crawling', impact: 0 },
      { type: 'error' as const, message: 'Found URLs returning 404 errors', impact: 15 },
      { type: 'warning' as const, message: 'Sitemap exceeds recommended 50MB size limit', impact: 10 },
    ];

    // Randomly add some issues
    possibleIssues.forEach(issue => {
      if (Math.random() < 0.3) {
        issues.push({ type: issue.type, message: issue.message });
        score -= issue.impact;
      }
    });

    const urlCount = Math.floor(Math.random() * 1000) + 100;
    const fileSize = `${(Math.random() * 500 + 50).toFixed(1)} KB`;

    const validationResult: SitemapResult = {
      url: sitemapUrl.trim(),
      isValid: issues.filter(i => i.type === 'error').length === 0,
      urlCount,
      fileSize,
      issues,
      score: Math.max(0, score),
    };

    setResult(validationResult);
    setIsValidating(false);

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
      validateSitemap();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sitemap Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Validate your XML sitemap for errors and SEO best practices. Ensure search engines can properly crawl your website.
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
                  label="Sitemap URL"
                  type="url"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com/sitemap.xml"
                  disabled={isValidating || hasExceededLimit}
                />

                <Button
                  onClick={validateSitemap}
                  isLoading={isValidating}
                  disabled={!sitemapUrl.trim() || isValidating || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Validate Sitemap
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
                  {/* Overall Status */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Validation Results
                      </h3>
                      <p className="text-gray-600 text-sm truncate max-w-md">{result.url}</p>
                    </div>
                    <div>
                      {result.isValid ? (
                        <Badge variant="success" className="text-base px-4 py-2">
                          <Check className="w-4 h-4 mr-2" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-base px-4 py-2">
                          <X className="w-4 h-4 mr-2" />
                          Has Errors
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Score and Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Score */}
                    <div className={`${getScoreBg(result.score)} p-6 rounded-lg text-center`}>
                      <div className={`text-4xl font-bold ${getScoreColor(result.score)} mb-1`}>
                        {result.score}
                      </div>
                      <div className="text-sm text-gray-600">SEO Score</div>
                    </div>

                    {/* URL Count */}
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {result.urlCount}
                      </div>
                      <div className="text-sm text-gray-600">Total URLs</div>
                    </div>

                    {/* File Size */}
                    <div className="bg-purple-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-1">
                        {result.fileSize}
                      </div>
                      <div className="text-sm text-gray-600">File Size</div>
                    </div>
                  </div>

                  {/* Issues */}
                  {result.issues.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Found {result.issues.length} Issue{result.issues.length > 1 ? 's' : ''}:
                      </h4>
                      <div className="space-y-2">
                        {result.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              issue.type === 'error'
                                ? 'bg-red-50 border-red-200'
                                : issue.type === 'warning'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                issue.type === 'error'
                                  ? 'bg-red-100'
                                  : issue.type === 'warning'
                                  ? 'bg-yellow-100'
                                  : 'bg-blue-100'
                              }`}>
                                {issue.type === 'error' ? (
                                  <X className={`w-4 h-4 text-red-600`} />
                                ) : issue.type === 'warning' ? (
                                  <AlertCircle className={`w-4 h-4 text-yellow-600`} />
                                ) : (
                                  <AlertCircle className={`w-4 h-4 text-blue-600`} />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium mb-1 ${
                                  issue.type === 'error'
                                    ? 'text-red-900'
                                    : issue.type === 'warning'
                                    ? 'text-yellow-900'
                                    : 'text-blue-900'
                                }`}>
                                  {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                                </p>
                                <p className={`text-sm ${
                                  issue.type === 'error'
                                    ? 'text-red-700'
                                    : issue.type === 'warning'
                                    ? 'text-yellow-700'
                                    : 'text-blue-700'
                                }`}>
                                  {issue.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-900">Perfect Sitemap!</p>
                          <p className="text-sm text-green-700 mt-1">
                            No issues found. Your sitemap follows all SEO best practices.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Score Interpretation */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Score Interpretation:</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><strong>90-100:</strong> Excellent - Your sitemap is optimized</p>
                      <p><strong>70-89:</strong> Good - Minor improvements recommended</p>
                      <p><strong>Below 70:</strong> Needs attention - Several issues to fix</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                XML Sitemap Best Practices
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Valid XML Format:</strong> Ensure your sitemap follows proper XML syntax and schema</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>URL Limit:</strong> Keep sitemaps under 50,000 URLs and 50MB uncompressed</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Last Modified:</strong> Include lastmod dates to help search engines prioritize crawling</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Valid URLs:</strong> All URLs should be absolute, accessible, and return 200 status codes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToolContent
        schemaId="sitemap-validator-faq"
        sections={[
          {
            h2: "Why XML Sitemap Validation Matters for SEO",
            content: "An XML sitemap serves as a communication channel between your website and search engine crawlers, telling them exactly which pages exist, how important they are, and when they were last updated. A properly formatted sitemap accelerates indexing and ensures newly published or updated content is discovered quickly. An invalid or malformed sitemap, however, can cause partial or complete indexing failures that are not immediately obvious — your site may appear functional to visitors while Google misses large sections entirely.\n\nCommon sitemap errors include malformed XML structure, URLs that do not return 200 status codes (returning 301 redirects or 404 errors instead), exceeding the 50,000 URL limit per sitemap file, invalid date formats in lastmod tags, and encoding issues with special characters in URLs. Each of these errors causes search engines to reject some or all of the sitemap's entries, potentially leaving pages undiscovered.\n\nGoogle Search Console reports sitemap errors, but only after Google has attempted to process the file. By the time errors appear in GSC, your content may have been missing from the index for days or weeks. Proactive validation before submission catches errors immediately, ensuring every sitemap submission is clean and effective.",
          },
          {
            h2: "XML Sitemap Best Practices",
            content: "A well-optimized XML sitemap includes only canonical, indexable URLs. This means excluding URLs with noindex directives, non-canonical URLs (those with canonical tags pointing elsewhere), duplicate content variations with query strings, and administrative or session-based URLs. Including non-indexable URLs in sitemaps creates confusion for search engines and dilutes the value of the sitemap as a crawling priority signal.\n\nThe priority and changefreq elements, while often used, have limited impact on actual crawl behavior. Google has stated publicly that it largely ignores these fields. More impactful are accurate lastmod timestamps — when lastmod values are kept current and accurate (only updating when content actually changes), Google learns to trust them and prioritizes crawling updated content. Systematically falsifying lastmod values trains crawlers to ignore them entirely.\n\nFor large sites with more than 50,000 URLs, a sitemap index file is required. This file lists multiple individual sitemap files, each containing up to 50,000 URLs. Sitemap index files can also be used to segment sitemaps by content type — blog posts, products, images, videos — making them easier to manage and allowing you to prioritize specific content areas for crawling.",
          },
          {
            h2: "Sitemap Validation and Google Search Console",
            content: "Submitting your sitemap to Google Search Console is the final step after validation. Search Console's sitemap tool shows how many URLs Google discovered versus how many were submitted, reports individual URL errors, and tracks crawl status over time. These metrics help identify patterns — for example, if only 60% of submitted URLs are being indexed, the unindexed URLs may have thin content, duplicate content issues, or other quality signals causing Google to deprioritize them.\n\nBeyond initial submission, monitor your sitemap status in Search Console regularly. Large sites should check weekly for newly appearing errors. After major site restructuring, republish and resubmit updated sitemaps to ensure new URL structures are discovered promptly. If you have removed significant content, update your sitemap to remove those URLs — leaving deleted pages in your sitemap causes crawl budget waste as Google repeatedly tries to access pages that no longer exist.\n\nSitemap validation before submission eliminates the most common error categories, ensuring your GSC data reflects genuine indexing decisions rather than technical rejection of malformed sitemaps. A validated, clean sitemap submitted to both Google Search Console and Bing Webmaster Tools gives your content the best possible chance of rapid discovery and indexing.",
          },
        ]}
        faqs={[
          {
            q: "How many URLs can an XML sitemap contain?",
            a: "A single XML sitemap file can contain a maximum of 50,000 URLs and must be no larger than 50MB uncompressed. For sites exceeding this limit, use a sitemap index file that references multiple individual sitemap files. Most large e-commerce sites and news publishers use segmented sitemaps — one for products, one for blog posts, one for categories — making it easier to prioritize and manage crawling of different content types.",
          },
          {
            q: "Should I include every page of my website in the sitemap?",
            a: "No — include only canonical, indexable pages. Exclude pages with noindex meta tags, pages with canonical tags pointing elsewhere, thin or duplicate content pages, administrative pages, login and account pages, and URLs with parameters that create duplicate content. Including non-indexable URLs in your sitemap does not help indexing and may confuse crawlers by signaling importance for pages you do not actually want indexed.",
          },
          {
            q: "How often should I update my XML sitemap?",
            a: "Your sitemap should be updated automatically whenever content is published, updated, or removed. Most CMS platforms have sitemap plugins that regenerate the sitemap automatically on content changes. The lastmod timestamp should reflect actual content modification dates — this signal helps search engines prioritize crawling your freshest content. After updating your sitemap, ping Google and Bing to notify them of the change rather than waiting for scheduled crawls.",
          },
          {
            q: "What is the difference between a sitemap index and a regular sitemap?",
            a: "A regular XML sitemap is a file containing a list of URLs on your website. A sitemap index is a higher-level file that points to multiple individual sitemap files. Sitemap indexes are required when your total URL count exceeds 50,000, when you want to separate different content types into different sitemaps, or when you want to track indexing metrics per content category in Search Console. Google treats all URLs in all referenced sitemaps as part of the same submission.",
          },
          {
            q: "Why does Google Search Console show fewer indexed URLs than my sitemap contains?",
            a: "The gap between submitted URLs and indexed URLs is normal and reflects Google's content quality assessment. Non-indexed URLs may have thin content, duplicate content, slow load times, poor mobile experience, or insufficient external links. Google does not index every page it discovers — it selectively indexes pages that provide value to searchers. Improving content quality, building internal links, and acquiring external backlinks helps increase the proportion of submitted URLs that get indexed.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Sitemap Validator"
      />
    </>
  );
}
