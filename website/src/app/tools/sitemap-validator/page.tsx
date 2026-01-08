'use client';

import { useState } from 'react';
import { CheckCircle, Check, X, AlertCircle, Loader2, FileText, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading } = useFreeTrial('sitemap-validator');

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
    const hasTrialsLeft = useOneTrial();
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
