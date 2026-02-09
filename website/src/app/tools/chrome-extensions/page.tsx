'use client';

import { useState } from 'react';
import { Puzzle, Check, X, AlertCircle, Loader2, Shield, Download, Star, Users, Calendar, Search, FileText, ExternalLink, MessageSquare, Chrome } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import RelatedTools from '@/components/tools/RelatedTools';

interface ExtensionInfo {
  name: string;
  version: string;
  description: string;
  rating: number;
  ratingCount: number;
  users: string;
  lastUpdated: string;
  permissions: string[];
  developer: string;
  category: string;
  website?: string;
  privacyPolicy?: string;
  iconUrl: string;
}

interface AnalysisResult {
  extensionId: string;
  info: ExtensionInfo;
  securityScore: number;
  risks: Array<{
    level: 'low' | 'medium' | 'high';
    message: string;
  }>;
  recommendations: string[];
}

export default function ChromeExtensionsPage() {
  const [extensionUrl, setExtensionUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('chrome-extensions');

  const extractExtensionId = (url: string): string | null => {
    // Extract extension ID from Chrome Web Store URL
    const patterns = [
      /chrome\.google\.com\/webstore\/detail\/[^/]+\/([a-z]{32})/i,
      /chrome\.google\.com\/webstore\/detail\/([a-z]{32})/i,
      /^([a-z]{32})$/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  const analyzeExtension = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!extensionUrl.trim()) {
      setError('Please enter a Chrome extension URL or ID');
      return;
    }

    const extensionId = extractExtensionId(extensionUrl.trim());
    if (!extensionId) {
      setError('Invalid Chrome extension URL or ID. Please enter a valid Chrome Web Store URL or extension ID.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      // Simulate API call - In production, this would call a backend service
      // that scrapes the Chrome Web Store or uses Chrome Web Store API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data - In production, this would be real data from the extension
      const mockResult: AnalysisResult = {
        extensionId,
        info: {
          name: 'Example Extension',
          version: '1.2.3',
          description: 'This is a mock analysis. In production, real extension data would be fetched from the Chrome Web Store.',
          rating: 4.5,
          ratingCount: 1234,
          users: '100,000+',
          lastUpdated: new Date().toLocaleDateString(),
          permissions: [
            'activeTab',
            'storage',
            'tabs',
            'webRequest',
            'cookies',
          ],
          developer: 'Example Developer',
          category: 'Productivity',
          website: 'https://example.com',
          privacyPolicy: 'https://example.com/privacy',
          iconUrl: 'https://via.placeholder.com/128',
        },
        securityScore: 75,
        risks: [
          {
            level: 'medium',
            message: 'Extension requests access to all website tabs',
          },
          {
            level: 'low',
            message: 'Extension can read and modify cookies',
          },
        ],
        recommendations: [
          'Review the extension permissions before installing',
          'Check user reviews for security concerns',
          'Verify the developer\'s identity and reputation',
          'Keep the extension updated to the latest version',
        ],
      };

      setResult(mockResult);

      // Use one trial
      const hasTrialsLeft = consumeTrial();
      if (!hasTrialsLeft) {
        setTimeout(() => setShowUpgradeModal(true), 2000);
      }
    } catch (err) {
      setError('Failed to analyze extension. Please try again later.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeExtension();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
              <Puzzle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Chrome Extensions Analyzer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Analyze Chrome extensions for security, permissions, and privacy concerns. Make informed decisions before installing.
            </p>

            {/* Trial counter */}
            {!isLoading && !hasExceededLimit && (
              <div className="mt-6">
                <Badge variant="default" className="text-sm">
                  {remainingTrials} free {remainingTrials === 1 ? 'analysis' : 'analyses'} remaining
                </Badge>
              </div>
            )}
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Chrome Extension URL or ID"
                  type="text"
                  value={extensionUrl}
                  onChange={(e) => {
                    setExtensionUrl(e.target.value);
                    setError(null);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="https://chrome.google.com/webstore/detail/... or extension ID"
                  disabled={isAnalyzing || hasExceededLimit}
                  error={error || undefined}
                />

                <p className="text-sm text-gray-500">
                  Enter the Chrome Web Store URL or the 32-character extension ID
                </p>

                <Button
                  onClick={analyzeExtension}
                  isLoading={isAnalyzing}
                  disabled={!extensionUrl.trim() || isAnalyzing || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Extension...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Analyze Extension
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
            <div className="space-y-6">
              {/* Extension Info Card */}
              <Card className="border-2 border-gray-200">
                <CardContent>
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={result.info.iconUrl}
                      alt={result.info.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {result.info.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{result.info.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">v{result.info.version}</Badge>
                        <Badge variant="info">{result.info.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{result.info.rating}</span>
                          <span>({result.info.ratingCount.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{result.info.users} users</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Updated: {result.info.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">By {result.info.developer}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Score Card */}
              <Card className="border-2 border-gray-200">
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Security Analysis</h3>
                    <Badge variant={getScoreBadge(result.securityScore)} className="text-lg px-4 py-2">
                      {result.securityScore}/100
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Security Score</span>
                      <span className={`text-sm font-semibold ${getScoreColor(result.securityScore)}`}>
                        {result.securityScore >= 80 ? 'Good' : result.securityScore >= 60 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          result.securityScore >= 80
                            ? 'bg-green-500'
                            : result.securityScore >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${result.securityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Permissions Requested:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.info.permissions.map((permission, index) => (
                        <Badge key={index} variant="default" className="font-mono text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  {result.risks.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Potential Risks:</h4>
                      <div className="space-y-3">
                        {result.risks.map((risk, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${getRiskColor(risk.level)}`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium capitalize">{risk.level} Risk</p>
                                <p className="text-sm mt-1">{risk.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations Card */}
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-indigo-600" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-indigo-600">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Our Extensions Section */}
          <div className="mt-10 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Our Chrome Extensions</h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">Built by the Sugesto team</p>

            <a
              href="https://chromewebstore.google.com/detail/ai-comment-generator/jklndoeadnikdojcbhlknfmgmhiohbje"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card hover className="border-2 border-indigo-100 group-hover:border-indigo-300 transition-all">
                <CardContent>
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://lh3.googleusercontent.com/W_rCruQM34lUBAy2cIGE43d6Na4VGkLkuskYmNL0_M18ZtEGNZ8fVhuqHs-OFs2F86NNue1eFpvdHQ3Ajo7mrJbmbfk=s128"
                      alt="AI Comment Generator"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">AI Comment Generator</h3>
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
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
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

          {/* Info Section */}
          <Card className="mt-8">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What We Analyze
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Permissions Analysis:</strong> Review all permissions requested by the extension</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Security Assessment:</strong> Identify potential security and privacy risks</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Reputation Check:</strong> Evaluate user ratings, reviews, and download counts</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Best Practices:</strong> Get recommendations for safe extension usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Chrome Extensions Analyzer"
      />
    </>
  );
}
