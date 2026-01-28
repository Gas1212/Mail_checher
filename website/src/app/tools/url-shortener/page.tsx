'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, Check, BarChart3, Calendar, Eye, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import RelatedTools from '@/components/tools/RelatedTools';
import { QrCode, Mail, Globe } from 'lucide-react';

interface ShortenedURL {
  original: string;
  shortened: string;
  clicks: number;
  created: string;
}

export default function URLShortenerPage() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleShorten = () => {
    // URL shortening requires an account
    // Show upgrade modal to encourage sign up
    setShowUpgradeModal(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              URL Shortener
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create short, branded links with detailed analytics. Track clicks, locations, and more. Create a free account to get started.
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Input
                    label="Long URL"
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    error={longUrl.trim() !== '' && !isValidUrl ? 'Please enter a valid URL' : undefined}
                  />
                </div>

                <div>
                  <Input
                    label="Custom Alias (Optional)"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="my-custom-link"
                    helperText="Leave empty for auto-generated short link"
                  />
                  {customAlias && (
                    <p className="mt-2 text-sm text-gray-600">
                      Your link will be: <span className="font-mono text-indigo-600">sugesto.xyz/{customAlias}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleShorten}
                  disabled={!isValidUrl}
                  className="w-full"
                  size="lg"
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Create Short Link
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Account Required:</strong> Create a free account to shorten URLs and access analytics. Get 100 short links per month.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Track clicks, referrers, devices, and geographic data for every link
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
                  Create branded short links with custom aliases for better recognition
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Link Management</h3>
                <p className="text-sm text-gray-600">
                  Edit, archive, or delete your short links anytime from your dashboard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example Section */}
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
                    <h4 className="font-medium text-gray-900 mb-1">Share & Track</h4>
                    <p className="text-sm text-gray-600">
                      Share your short link and monitor its performance with detailed analytics
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
                    <p className="text-sm text-gray-600">Share clean, trackable links on Twitter, Instagram, Facebook</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email Campaigns</p>
                    <p className="text-sm text-gray-600">Track email click-through rates with branded short links</p>
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

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="URL Shortener"
      />
    </>
  );
}
