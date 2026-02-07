'use client';

import { useState } from 'react';
import { QrCode, Download, Check, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RelatedTools from '@/components/tools/RelatedTools';

type QRType = 'url' | 'text' | 'email' | 'phone';

interface QROptions {
  type: QRType;
  data: string;
  size: number;
  color: string;
  backgroundColor: string;
}

export default function QRGeneratorPage() {
  const [qrOptions, setQrOptions] = useState<QROptions>({
    type: 'url',
    data: '',
    size: 300,
    color: '#000000',
    backgroundColor: '#ffffff',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const qrTypes = [
    { value: 'url' as QRType, label: 'URL/Website', icon: LinkIcon, placeholder: 'https://example.com' },
    { value: 'text' as QRType, label: 'Plain Text', icon: Check, placeholder: 'Enter your text here' },
    { value: 'email' as QRType, label: 'Email', icon: Mail, placeholder: 'email@example.com' },
    { value: 'phone' as QRType, label: 'Phone', icon: Phone, placeholder: '+1234567890' },
  ];

  const generateQRCode = async () => {
    if (!qrOptions.data.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      let formattedData = qrOptions.data;
      if (qrOptions.type === 'email') {
        formattedData = `mailto:${qrOptions.data}`;
      } else if (qrOptions.type === 'phone') {
        formattedData = `tel:${qrOptions.data}`;
      }

      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrOptions.size}x${qrOptions.size}&data=${encodeURIComponent(formattedData)}&color=${qrOptions.color.replace('#', '')}&bgcolor=${qrOptions.backgroundColor.replace('#', '')}`;

      setQrCodeUrl(apiUrl);
    } catch (error) {
      console.error('QR generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateQRCode();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              QR Code Generator
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Create custom QR codes for URLs, text, email, phone numbers, and more. 100% free, no account required.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Content</h3>

                  {/* Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      QR Code Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {qrTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setQrOptions({ ...qrOptions, type: type.value, data: '' })}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              qrOptions.type === type.value
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mx-auto mb-1 ${
                              qrOptions.type === type.value ? 'text-indigo-600' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              qrOptions.type === type.value ? 'text-indigo-600' : 'text-gray-700'
                            }`}>
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Data Input */}
                  <div className="mb-6">
                    <Input
                      label={`${qrTypes.find(t => t.value === qrOptions.type)?.label} Content`}
                      type="text"
                      value={qrOptions.data}
                      onChange={(e) => setQrOptions({ ...qrOptions, data: e.target.value })}
                      onKeyPress={handleKeyPress}
                      placeholder={qrTypes.find(t => t.value === qrOptions.type)?.placeholder}
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {qrOptions.size}x{qrOptions.size}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="500"
                      step="50"
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions({ ...qrOptions, size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>200px</span>
                      <span>500px</span>
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        QR Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={qrOptions.color}
                          onChange={(e) => setQrOptions({ ...qrOptions, color: e.target.value })}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          type="text"
                          value={qrOptions.color}
                          onChange={(e) => setQrOptions({ ...qrOptions, color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={qrOptions.backgroundColor}
                          onChange={(e) => setQrOptions({ ...qrOptions, backgroundColor: e.target.value })}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          type="text"
                          value={qrOptions.backgroundColor}
                          onChange={(e) => setQrOptions({ ...qrOptions, backgroundColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateQRCode}
                    isLoading={isGenerating}
                    disabled={!qrOptions.data.trim() || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>

                  {qrCodeUrl ? (
                    <div className="space-y-4">
                      <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCodeUrl}
                          alt="Generated QR Code"
                          className="max-w-full h-auto rounded-lg shadow-lg"
                          style={{ width: qrOptions.size, height: qrOptions.size }}
                        />
                      </div>
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-400">
                        <QrCode className="w-16 h-16 mx-auto mb-3" />
                        <p>Your QR code will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info Section */}
          <Card className="mt-8">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About QR Codes
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Free & Unlimited:</strong> Generate as many QR codes as you need, completely free</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Customizable:</strong> Choose colors, size, and content type for your QR codes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Multiple Types:</strong> Create QR codes for URLs, text, email, phone numbers, and more</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>High Quality:</strong> Download high-resolution QR codes perfect for print and digital use</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RelatedTools
        tools={[
          {
            name: 'URL Shortener',
            description: 'Create short, shareable links',
            href: '/tools/url-shortener',
            icon: LinkIcon,
            color: 'from-green-500 to-emerald-500',
          },
          {
            name: 'Sitemap Generator',
            description: 'Find website sitemaps',
            href: '/tools/sitemap-finder',
            icon: Check,
            color: 'from-cyan-500 to-blue-500',
          },
          {
            name: 'All Tools',
            description: 'Explore our complete toolset',
            href: '/tools',
            icon: QrCode,
            color: 'from-indigo-500 to-purple-500',
          },
        ]}
      />

      <Footer />
    </>
  );
}
