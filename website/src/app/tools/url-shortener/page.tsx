'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, Check, BarChart3, Calendar, ExternalLink, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RelatedTools from '@/components/tools/RelatedTools';
import { QrCode, Mail, Globe } from 'lucide-react';

interface ShortenedURL {
  original: string;
  shortened: string;
}

export default function URLShortenerPage() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShorten = async () => {
    if (!isValidUrl) return;

    setIsShortening(true);
    setError(null);
    setShortenedUrl(null);

    try {
      const apiUrl = customAlias
        ? `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}&shorturl=${encodeURIComponent(customAlias)}`
        : `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.shorturl) {
        setShortenedUrl({
          original: longUrl,
          shortened: data.shorturl,
        });
      } else if (data.errorcode) {
        setError(data.errormessage || 'Failed to shorten URL. Please try again.');
      }
    } catch {
      setError('Failed to shorten URL. Please check your connection and try again.');
    } finally {
      setIsShortening(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidUrl = longUrl.trim() !== '' && validateUrl(longUrl);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <LinkIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              URL Shortener
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Create short, shareable links instantly. 100% free, no account required.
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-6 sm:mb-8">
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Input
                    label="Long URL"
                    type="url"
                    value={longUrl}
                    onChange={(e) => {
                      setLongUrl(e.target.value);
                      setError(null);
                    }}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    error={longUrl.trim() !== '' && !isValidUrl ? 'Please enter a valid URL' : undefined}
                    disabled={isShortening}
                  />
                </div>

                <div>
                  <Input
                    label="Custom Alias (Optional)"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="my-custom-link"
                    helperText="Leave empty for auto-generated short link"
                    disabled={isShortening}
                  />
                  {customAlias && (
                    <p className="mt-2 text-sm text-gray-600">
                      Your link will be: <span className="font-mono text-indigo-600">is.gd/{customAlias}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleShorten}
                  disabled={!isValidUrl || isShortening}
                  isLoading={isShortening}
                  className="w-full"
                  size="lg"
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  {isShortening ? 'Shortening...' : 'Shorten URL'}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          {shortenedUrl && (
            <Card className="mb-8 border-2 border-green-200 bg-green-50/50">
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Short URL is Ready!</h3>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 max-w-md">
                      <a
                        href={shortenedUrl.shortened}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-mono font-medium hover:underline flex items-center justify-center gap-2"
                      >
                        {shortenedUrl.shortened}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(shortenedUrl.shortened)}
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Original: <span className="font-mono text-xs">{shortenedUrl.original.length > 60 ? shortenedUrl.original.substring(0, 60) + '...' : shortenedUrl.original}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Shortening</h3>
                <p className="text-sm text-gray-600">
                  Shorten any URL instantly with no sign-up or account needed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Aliases</h3>
                <p className="text-sm text-gray-600">
                  Create memorable short links with custom aliases for better recognition
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Permanent Links</h3>
                <p className="text-sm text-gray-600">
                  Your shortened links are permanent and will always redirect properly
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mb-8">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-indigo-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Enter Your Long URL</h4>
                    <p className="text-sm text-gray-600">
                      Paste any long URL that you want to shorten and make easier to share
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-indigo-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Customize (Optional)</h4>
                    <p className="text-sm text-gray-600">
                      Add a custom alias to make your link memorable and branded
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-indigo-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Copy & Share</h4>
                    <p className="text-sm text-gray-600">
                      Copy your shortened link and share it anywhere - social media, emails, messages
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Perfect For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Social Media Marketing</p>
                    <p className="text-sm text-gray-600">Share clean, short links on Twitter, Instagram, Facebook</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email Campaigns</p>
                    <p className="text-sm text-gray-600">Use short links in your email campaigns for cleaner appearance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">QR Codes</p>
                    <p className="text-sm text-gray-600">Create short URLs perfect for QR code generation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Print Materials</p>
                    <p className="text-sm text-gray-600">Add short, memorable links to business cards and flyers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RelatedTools
        tools={[
          {
            name: 'QR Code Generator',
            description: 'Generate QR codes for your links',
            href: '/tools/qr-generator',
            icon: QrCode,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            name: 'Email Validator',
            description: 'Verify email addresses',
            href: '/tools/email-checker',
            icon: Mail,
            color: 'from-indigo-500 to-purple-500',
          },
          {
            name: 'All Tools',
            description: 'Explore our complete toolset',
            href: '/tools',
            icon: Globe,
            color: 'from-green-500 to-emerald-500',
          },
        ]}
      />

      <Footer />
    </>
  );
}
