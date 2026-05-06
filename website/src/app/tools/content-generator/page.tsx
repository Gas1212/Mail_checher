'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, FileText, MessageSquare, Mail, Key, Zap, Lock, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

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
type ProviderType = 'sugesto' | 'groq';

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

const GROQ_PROMPTS: Record<ContentType, (name: string, features: string, audience: string, tone: string, lang: string, ctx: string) => string> = {
  'product-title': (name, features, audience, tone, lang, ctx) =>
    `Write a single SEO-optimized product title for "${name}". Max 60 characters. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key features: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the title, no explanation.`,

  'meta-description': (name, features, audience, tone, lang, ctx) =>
    `Write a single SEO meta description for "${name}". Between 150-160 characters. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Features: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the meta description, no explanation.`,

  'product-description': (name, features, audience, tone, lang, ctx) =>
    `Write a product description for "${name}". Between 150-200 words. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Features: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the description.`,

  'linkedin-post': (name, features, audience, tone, lang, ctx) =>
    `Write a LinkedIn post about "${name}". Professional, engaging, with 3-5 relevant hashtags at the end. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the post.`,

  'facebook-post': (name, features, audience, tone, lang, ctx) =>
    `Write a Facebook post about "${name}". Engaging and shareable, with 2-3 hashtags. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the post.`,

  'instagram-post': (name, features, audience, tone, lang, ctx) =>
    `Write an Instagram caption for "${name}". Use emojis, compelling text, and 5-10 hashtags at the end. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the caption.`,

  'tiktok-post': (name, features, audience, tone, lang, ctx) =>
    `Write a TikTok caption for "${name}". Short, viral-worthy, with trending hashtags. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the caption.`,

  'email-subject': (name, features, audience, tone, lang, ctx) =>
    `Write a single email subject line for "${name}". Max 50 characters, attention-grabbing. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the subject line.`,

  'email-body': (name, features, audience, tone, lang, ctx) =>
    `Write a complete marketing email body${name ? ` for "${name}"` : ''}. Between 150-200 words, professional structure. Tone: ${tone}. Language: ${lang === 'fr' ? 'French' : 'English'}. ${features ? `Key points: ${features}.` : ''} ${audience ? `Target: ${audience}.` : ''} ${ctx ? `Context: ${ctx}.` : ''} Return ONLY the email body.`,
};

export default function ContentGeneratorPage() {
  const [provider, setProvider] = useState<ProviderType>('sugesto');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

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

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('content-generator');

  const contentTypes: ContentTypeOption[] = [
    { id: 'product-title', name: 'Product Title', description: 'SEO-optimized (60 chars)', icon: <FileText className="w-5 h-5" />, category: 'product' },
    { id: 'meta-description', name: 'Meta Description', description: 'SEO description (150-160 chars)', icon: <FileText className="w-5 h-5" />, category: 'product' },
    { id: 'product-description', name: 'Product Description', description: 'Detailed description (150-200 words)', icon: <FileText className="w-5 h-5" />, category: 'product' },
    { id: 'linkedin-post', name: 'LinkedIn Post', description: 'Professional post with hashtags', icon: <MessageSquare className="w-5 h-5" />, category: 'social' },
    { id: 'facebook-post', name: 'Facebook Post', description: 'Engaging social post', icon: <MessageSquare className="w-5 h-5" />, category: 'social' },
    { id: 'instagram-post', name: 'Instagram Post', description: 'Caption with emojis & hashtags', icon: <MessageSquare className="w-5 h-5" />, category: 'social' },
    { id: 'tiktok-post', name: 'TikTok Post', description: 'Viral caption with hashtags', icon: <MessageSquare className="w-5 h-5" />, category: 'social' },
    { id: 'email-subject', name: 'Email Subject', description: 'Attention-grabbing (50 chars)', icon: <Mail className="w-5 h-5" />, category: 'email' },
    { id: 'email-body', name: 'Email Body', description: 'Complete email (150-200 words)', icon: <Mail className="w-5 h-5" />, category: 'email' },
  ];

  const generateWithGroq = async () => {
    if (!groqApiKey.trim()) {
      setError('Please enter your Groq API key');
      return;
    }

    const prompt = GROQ_PROMPTS[selectedType](
      productName, productFeatures, targetAudience, tone, language, additionalContext
    );

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('Invalid Groq API key. Get a free key at console.groq.com');
      throw new Error(err?.error?.message || 'Groq API error. Please check your API key.');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    return {
      content,
      model: data.model || 'llama-3.1-8b-instant',
      metadata: {
        content_type: selectedType,
        tone,
        language,
        character_count: content.length,
      },
    };
  };

  const generateWithSugesto = async () => {
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return null;
    }

    const response = await fetch('https://gas1911.serv00.net/api/content-generator/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (!response.ok || !data.success) throw new Error(data.error || 'Failed to generate content');

    const hasTrialsLeft = consumeTrial();
    if (!hasTrialsLeft) setTimeout(() => setShowUpgradeModal(true), 2000);

    return data;
  };

  const generateContent = async () => {
    if (provider === 'sugesto' && hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }
    if (!productName.trim() && selectedType !== 'email-body') {
      setError('Product name is required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const data = provider === 'groq' ? await generateWithGroq() : await generateWithSugesto();
      if (data) setResult(data);
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

  const isDisabled = isGenerating || (provider === 'sugesto' && hasExceededLimit);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              AI Content Generator
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Generate professional marketing content with AI. Product descriptions, social media posts, and email content in seconds.
            </p>
          </div>

          {/* Provider Selection */}
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Sugesto AI */}
              <button
                onClick={() => setProvider('sugesto')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  provider === 'sugesto'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${provider === 'sugesto' ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                    <Sparkles className={`w-4 h-4 ${provider === 'sugesto' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${provider === 'sugesto' ? 'text-indigo-900' : 'text-gray-900'}`}>Sugesto AI</p>
                    <p className="text-xs text-gray-500">No setup needed</p>
                  </div>
                  {!isLoading && (
                    <Badge variant={hasExceededLimit ? 'error' : 'default'} className="ml-auto text-xs">
                      {hasExceededLimit ? 'Limit reached' : `${remainingTrials} free tries`}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Limited free usage
                </p>
              </button>

              {/* Groq API */}
              <button
                onClick={() => setProvider('groq')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  provider === 'groq'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${provider === 'groq' ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <Zap className={`w-4 h-4 ${provider === 'groq' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${provider === 'groq' ? 'text-green-900' : 'text-gray-900'}`}>Groq API</p>
                    <p className="text-xs text-gray-500">Your own API key</p>
                  </div>
                  <Badge variant="success" className="ml-auto text-xs">Unlimited</Badge>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Key className="w-3 h-3" /> Free key at console.groq.com
                </p>
              </button>
            </div>

            {/* Groq API Key input */}
            {provider === 'groq' && (
              <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-green-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4" /> Groq API Key
                  </label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-700 hover:text-green-800 flex items-center gap-1 font-medium"
                  >
                    Get free key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    placeholder="gsk_..."
                    className="flex-1 px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-3 py-2 text-xs text-green-700 border border-green-300 rounded-lg hover:bg-green-100 bg-white"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-green-700 mt-1.5">
                  Your key is used directly from your browser and never stored on our servers.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Content Type Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Content Type</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        disabled={isDisabled}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all ${
                          selectedType === type.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className={`mt-0.5 flex-shrink-0 ${selectedType === type.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {type.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className={`text-xs sm:text-sm font-medium ${selectedType === type.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                {type.name}
                              </p>
                              <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded ml-1 flex-shrink-0 ${getCategoryBadgeColor(type.category)}`}>
                                {type.category}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Input Form & Results */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Content Details</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {selectedType !== 'email-body' && (
                      <Input
                        label="Product/Service Name *"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Email Validation Tool"
                        disabled={isDisabled}
                      />
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Features (optional)</label>
                      <textarea
                        value={productFeatures}
                        onChange={(e) => setProductFeatures(e.target.value)}
                        placeholder="Real-time validation, bulk checking, API access..."
                        disabled={isDisabled}
                        rows={2}
                        className="w-full px-3 py-2.5 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white disabled:opacity-50"
                      />
                    </div>

                    <Input
                      label="Target Audience (optional)"
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Digital marketers, developers..."
                      disabled={isDisabled}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value as ToneType)}
                          disabled={isDisabled}
                          className="w-full px-3 py-2.5 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white disabled:opacity-50 min-h-[44px]"
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
                          disabled={isDisabled}
                          className="w-full px-3 py-2.5 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white disabled:opacity-50 min-h-[44px]"
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context (optional)</label>
                      <textarea
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                        placeholder="Any additional instructions or context..."
                        disabled={isDisabled}
                        rows={2}
                        className="w-full px-3 py-2.5 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white disabled:opacity-50"
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
                      disabled={isDisabled}
                      className={`w-full ${provider === 'groq' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : ''}`}
                      size="lg"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</>
                      ) : provider === 'sugesto' && hasExceededLimit ? (
                        'Free Trial Limit Reached'
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" />Generate Content</>
                      )}
                    </Button>

                    {provider === 'sugesto' && hasExceededLimit && (
                      <div className="text-center space-y-2">
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          Create a free account to continue →
                        </button>
                        <p className="text-xs text-gray-500">
                          Or use your{' '}
                          <button onClick={() => setProvider('groq')} className="text-green-600 hover:text-green-700 font-medium">
                            Groq API key for unlimited access
                          </button>
                        </p>
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
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Generated Content</h3>
                      <div className="flex items-center gap-2">
                        {provider === 'groq' && (
                          <Badge variant="success" className="text-xs">Groq</Badge>
                        )}
                        <Button onClick={copyToClipboard} variant="outline" size="sm">
                          {copied ? <><Check className="w-4 h-4 mr-1.5" />Copied!</> : <><Copy className="w-4 h-4 mr-1.5" />Copy</>}
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg mb-3 sm:mb-4">
                      <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap">{result.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{result.metadata.character_count} chars</span>
                        <span className="capitalize">{result.metadata.tone}</span>
                        <span className="uppercase">{result.metadata.language}</span>
                      </div>
                      <span>{result.model.split('/').pop()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Info Section */}
          <Card className="mt-6 sm:mt-8">
            <CardContent>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm text-gray-600">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Choose your provider</p>
                  <p className="text-xs sm:text-sm">Use Sugesto AI (3 free tries) or your own Groq API key for unlimited generation</p>
                </div>
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Fill in Details</p>
                  <p className="text-xs sm:text-sm">Enter your product name, features, target audience and tone preferences</p>
                </div>
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Generate & Use</p>
                  <p className="text-xs sm:text-sm">AI generates professional content in seconds. Copy and use it immediately</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToolContent
        schemaId="content-generator-faq"
        sections={[
          {
            h2: "AI-Powered Content Creation for Email Marketing",
            content: "Artificial intelligence has fundamentally changed the economics of content creation. Tasks that previously required hours of writer time — researching email topics, drafting subject lines, writing full email sequences — can now be completed in minutes with AI assistance. For email marketers managing multiple campaigns simultaneously, AI-powered content generation creates the capacity to produce more personalized, targeted content without proportionally increasing costs.\n\nOur content generator uses advanced language models trained on high-performing email marketing copy to produce content that aligns with email marketing best practices: compelling subject lines with appropriate urgency and specificity, preview text optimized for open rates, body copy that focuses on recipient benefits rather than sender features, and clear calls-to-action that drive specific behaviors.\n\nThe generated content serves as a high-quality first draft — not necessarily final copy. Effective use of AI content generation treats the output as a starting point that a human editor reviews, personalizes with brand voice, and adapts with specific product details or customer context. This hybrid approach combines the speed of AI generation with the judgment and brand knowledge of experienced marketers.",
          },
          {
            h2: "Creating Effective Email Copy with AI Assistance",
            content: "Effective email copy follows specific structural principles that AI content generators are trained to implement. The subject line is the most critical element — the only part of an email many recipients ever read. High-performing subject lines create curiosity, communicate a specific benefit, use personalization when appropriate, and avoid spam trigger words. Our generator produces multiple subject line variations with different emotional angles, allowing A/B testing of approaches.\n\nEmail body copy benefits from the inverted pyramid structure: most important information first, supporting details below, call-to-action at multiple points. Recipients scan emails rather than reading linearly, so lead sentences carry disproportionate weight. AI generation trained on email copy structure automatically applies these principles, creating scannable content with short paragraphs and clear hierarchy.\n\nPersonalization beyond first name insertion significantly impacts email performance. Content that references the recipient's industry, role, past behavior, or specific pain points performs measurably better than generic content. Our generator supports template personalization variables that let you inject specific recipient context into AI-generated base content, scaling personalization across thousands of recipients.",
          },
          {
            h2: "Content Generation Best Practices and Quality Control",
            content: "AI-generated content requires human oversight for quality control, brand alignment, and factual accuracy. Language models can produce fluent, professional-sounding text that contains incorrect information, inappropriate brand voice, or subtle logical errors. Establishing a review process that checks generated content before sending is essential — particularly for claims about products, pricing, legal terms, or anything requiring factual accuracy.\n\nBrand voice calibration improves AI content quality significantly. Providing the generator with example emails that represent your ideal voice and tone allows the AI to produce output that sounds like your brand rather than generic marketing copy. Some content generators support system prompts that encode brand voice instructions, making successive generations more consistent.\n\nContent generation works best for scalable tasks: welcome sequences, re-engagement campaigns, promotional emails, product announcement templates, and follow-up sequences. For highly personalized one-to-one communications, unique thought leadership content, or content requiring specific expertise and original research, human writing remains more effective. Understanding which use cases AI generation excels at helps marketers allocate their content production resources optimally.",
          },
        ]}
        faqs={[
          {
            q: "What types of email content can the AI generator create?",
            a: "The content generator creates various email types: welcome sequences, promotional announcements, product updates, re-engagement campaigns, cold outreach emails, follow-up sequences, newsletter content, transactional email copy, and subject line variations. It also generates email components separately: subject lines, preview text, opening lines, calls-to-action, and PS lines. Different email types require different tones and structures, and our generator adapts its output to the specific email type you specify.",
          },
          {
            q: "How do I ensure generated content matches my brand voice?",
            a: "To align generated content with your brand voice, provide examples of your existing email copy as reference, specify tone parameters (formal/casual, serious/playful, technical/accessible), and include brand-specific terminology or phrases to include or avoid. Review initial outputs and provide feedback about what to adjust — most generators improve with iteration. Creating a brand voice guide document with specific examples helps ensure consistent output across all generated content.",
          },
          {
            q: "Can AI-generated email content avoid spam filters?",
            a: "AI generators can be trained to avoid common spam trigger words and patterns, but spam filtering has evolved well beyond word-matching. Modern spam filters analyze sender reputation, authentication status (SPF, DKIM, DMARC), recipient engagement history, and content-image ratio alongside content signals. Clean email copy from AI generation helps, but inbox placement ultimately depends primarily on sender reputation and authentication infrastructure, not content alone.",
          },
          {
            q: "How many variations should I generate for A/B testing?",
            a: "For subject line A/B testing, 2-4 variations with different emotional angles (curiosity, benefit, urgency, social proof) provides actionable test data. For body copy, 2 variations are typically sufficient — testing more simultaneously requires larger audience segments to achieve statistical significance. The most important tests are those addressing the highest-impact elements: subject line first (biggest impact on open rate), then primary CTA (biggest impact on click rate).",
          },
          {
            q: "Is AI-generated email content detectable by spam filters?",
            a: "Current spam filters do not specifically target AI-generated content — they analyze signals like sender reputation, authentication, engagement patterns, and specific content characteristics rather than whether text was human or AI-written. The content quality from modern AI generators typically performs similarly to human-written content in spam filter evaluation. The primary risk with AI-generated content is generic, impersonal copy that results in low engagement, which indirectly affects sender reputation through spam reports and inactivity.",
          },
        ]}
      />
      <Footer />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="AI Content Generator"
      />
    </>
  );
}
