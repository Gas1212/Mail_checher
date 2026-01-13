'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Copy, Check, Loader2, FileText, MessageSquare, Mail } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import { useCredits } from '@/hooks/useCredits';
import CreditsDisplay from '@/components/ui/CreditsDisplay';

type ContentType =
  | 'product-title'
  | 'meta-description'
  | 'product-description'
  | 'linkedin-post'
  | 'facebook-post'
  | 'instagram-post'
  | 'tiktok-post'
  | 'email-subject'
  | 'email-body';

type ToneType = 'professional' | 'casual' | 'enthusiastic' | 'formal';
type LanguageType = 'en' | 'fr';

interface ContentTypeOption {
  id: ContentType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'product' | 'social' | 'email';
}

interface GeneratedResult {
  content: string;
  model: string;
  metadata: {
    content_type: string;
    tone: string;
    language: string;
    character_count: number;
  };
}

export default function ContentGeneratorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState<ContentType>('product-title');
  const [productName, setProductName] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [language, setLanguage] = useState<LanguageType>('en');
  const [additionalContext, setAdditionalContext] = useState('');

  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading: freeTrialLoading } = useFreeTrial('content-generator');
  const {
    credits,
    isRateLimited,
    rateLimitReset,
    isLoading: creditsLoading,
    consumeCredit,
    rateLimit,
  } = useCredits('content-generator', !!user);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const contentTypes: ContentTypeOption[] = [
    {
      id: 'product-title',
      name: 'Product Title',
      description: 'SEO-optimized (60 chars)',
      icon: <FileText className="w-5 h-5" />,
      category: 'product'
    },
    {
      id: 'meta-description',
      name: 'Meta Description',
      description: 'SEO description (150-160 chars)',
      icon: <FileText className="w-5 h-5" />,
      category: 'product'
    },
    {
      id: 'product-description',
      name: 'Product Description',
      description: 'Detailed description (150-200 words)',
      icon: <FileText className="w-5 h-5" />,
      category: 'product'
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      description: 'Professional post with hashtags',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'social'
    },
    {
      id: 'facebook-post',
      name: 'Facebook Post',
      description: 'Engaging social post',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'social'
    },
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      description: 'Caption with emojis & hashtags',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'social'
    },
    {
      id: 'tiktok-post',
      name: 'TikTok Post',
      description: 'Viral caption with hashtags',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'social'
    },
    {
      id: 'email-subject',
      name: 'Email Subject',
      description: 'Attention-grabbing (50 chars)',
      icon: <Mail className="w-5 h-5" />,
      category: 'email'
    },
    {
      id: 'email-body',
      name: 'Email Body',
      description: 'Complete email (150-200 words)',
      icon: <Mail className="w-5 h-5" />,
      category: 'email'
    },
  ];

  const generateContent = async () => {
    // Check if user is authenticated
    if (user) {
      // Authenticated user - use credit system
      if (credits.available <= 0) {
        setError('No credits available. Credits will reset next month.');
        return;
      }

      if (isRateLimited) {
        const waitSeconds = Math.ceil((rateLimitReset - Date.now()) / 1000);
        setError(`Rate limit exceeded. Please wait ${waitSeconds} seconds.`);
        return;
      }

      // Use credit before making request
      const creditResult = consumeCredit();
      if (!creditResult.success) {
        setError(creditResult.message || 'Failed to use credit');
        return;
      }
    } else {
      // Non-authenticated user - use free trial
      if (hasExceededLimit) {
        setShowUpgradeModal(true);
        return;
      }
    }

    if (!productName.trim() && selectedType !== 'email-body') {
      setError('Product name is required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://gas1911.serv00.net/api/content-generator/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: selectedType,
          product_name: productName,
          product_features: productFeatures,
          target_audience: targetAudience,
          tone,
          language,
          additional_context: additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data);

      // For non-authenticated users, use one trial after successful generation
      if (!user) {
        const hasTrialsLeft = useOneTrial();
        if (!hasTrialsLeft) {
          setTimeout(() => setShowUpgradeModal(true), 2000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'email': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} profile={profile} onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI Content Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate professional marketing content with AI. Product descriptions, social media posts, and email content in seconds.
            </p>

            {!isLoading && !hasExceededLimit && (
              <div className="mt-6">
                <Badge variant="default" className="text-sm">
                  {remainingTrials} free {remainingTrials === 1 ? 'try' : 'tries'} remaining
                </Badge>
              </div>
            )}
          </div>

          {/* Credits Display - Only for authenticated users */}
          {user && (
            <div className="mb-8 max-w-md mx-auto">
              <CreditsDisplay
                available={credits.available}
                total={credits.total}
                used={credits.used}
                isRateLimited={isRateLimited}
                rateLimitReset={rateLimitReset}
                rateLimit={rateLimit}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Content Type Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-4">Content Type</h3>
                  <div className="space-y-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        disabled={isGenerating || hasExceededLimit}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedType === type.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                        } ${isGenerating || hasExceededLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 ${selectedType === type.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {type.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-sm font-medium ${selectedType === type.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                {type.name}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded ${getCategoryBadgeColor(type.category)}`}>
                                {type.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Input Form & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Form */}
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-4">Content Details</h3>
                  <div className="space-y-4">
                    {selectedType !== 'email-body' && (
                      <Input
                        label="Product/Service Name *"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Email Validation Tool"
                        disabled={isGenerating || hasExceededLimit}
                      />
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Features (optional)
                      </label>
                      <textarea
                        value={productFeatures}
                        onChange={(e) => setProductFeatures(e.target.value)}
                        placeholder="Real-time validation, bulk checking, API access..."
                        disabled={isGenerating || hasExceededLimit}
                        rows={2}
                        className="w-full px-3 py-2.5 sm:px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white disabled:opacity-50"
                      />
                    </div>

                    <Input
                      label="Target Audience (optional)"
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Digital marketers, developers..."
                      disabled={isGenerating || hasExceededLimit}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value as ToneType)}
                          disabled={isGenerating || hasExceededLimit}
                          className="w-full px-3 py-2.5 sm:px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white disabled:opacity-50 min-h-[44px]"
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="enthusiastic">Enthusiastic</option>
                          <option value="formal">Formal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as LanguageType)}
                          disabled={isGenerating || hasExceededLimit}
                          className="w-full px-3 py-2.5 sm:px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white disabled:opacity-50 min-h-[44px]"
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Context (optional)
                      </label>
                      <textarea
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                        placeholder="Any additional instructions or context..."
                        disabled={isGenerating || hasExceededLimit}
                        rows={2}
                        className="w-full px-3 py-2.5 sm:px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white disabled:opacity-50"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={generateContent}
                      isLoading={isGenerating}
                      disabled={isGenerating || hasExceededLimit}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : hasExceededLimit ? (
                        'Free Trial Limit Reached'
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Content
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

              {/* Results */}
              {result && (
                <Card className="border-2 border-indigo-200">
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Generated Content</h3>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{result.content}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{result.metadata.character_count} characters</span>
                        <span className="capitalize">{result.metadata.tone} tone</span>
                        <span className="uppercase">{result.metadata.language}</span>
                      </div>
                      <span className="text-gray-400">Model: {result.model.split('/').pop()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Info Section */}
          <Card className="mt-8">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Choose Content Type</p>
                  <p>Select from 9 different content types including product descriptions, social posts, and emails</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Provide Details</p>
                  <p>Enter your product name, features, target audience, and choose your preferred tone and language</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Generate & Use</p>
                  <p>AI generates professional content in seconds. Copy and use it in your marketing materials</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="AI Content Generator"
      />
    </div>
  );
}
