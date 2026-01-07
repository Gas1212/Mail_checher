'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  Server,
  Shield,
  Sparkles,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface URLInfo {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

interface ValidationResult {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  url_count: number;
  urls: URLInfo[];
  total_size_mb: number;
  validated_at: string;
  recommendations: string[];
}

export default function SitemapValidator() {
  const [inputType, setInputType] = useState<'url' | 'content'>('url');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [sitemapContent, setSitemapContent] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const body = inputType === 'url'
        ? { sitemap_url: sitemapUrl }
        : { sitemap_content: sitemapContent };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/validate-sitemap/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate sitemap');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while validating sitemap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Email Checker</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/tools/bulk-checker"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Mail className="w-5 h-5" />
            <span>Bulk Email Checker</span>
          </Link>

          <Link
            href="/tools/mx-lookup"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Server className="w-5 h-5" />
            <span>MX Lookup</span>
          </Link>

          <Link
            href="/tools/role-detector"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Shield className="w-5 h-5" />
            <span>Role Detector</span>
          </Link>

          <Link
            href="/tools/list-cleaner"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Sparkles className="w-5 h-5" />
            <span>List Cleaner</span>
          </Link>

          <Link
            href="/tools/spf-generator"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Shield className="w-5 h-5" />
            <span>SPF Generator</span>
          </Link>

          <Link
            href="/tools/blacklist-checker"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Blacklist Checker</span>
          </Link>

          <Link
            href="/tools/sitemap-generator"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <FileText className="w-5 h-5" />
            <span>Sitemap Generator</span>
          </Link>

          <Link
            href="/tools/sitemap-validator"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Sitemap Validator</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 absolute bottom-0 w-64">
          <button className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap Validator</h1>
            <p className="text-gray-600">Validate your XML sitemap for errors and best practices</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Validate Sitemap</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleValidate} className="space-y-6">
                <div>
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setInputType('url')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        inputType === 'url'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Globe className="w-4 h-4 inline mr-2" />
                      Sitemap URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputType('content')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        inputType === 'content'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      XML Content
                    </button>
                  </div>

                  {inputType === 'url' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sitemap URL
                      </label>
                      <Input
                        type="url"
                        value={sitemapUrl}
                        onChange={(e) => setSitemapUrl(e.target.value)}
                        placeholder="https://example.com/sitemap.xml"
                        required
                        className="w-full"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter the full URL to your sitemap.xml file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sitemap XML Content
                      </label>
                      <textarea
                        value={sitemapContent}
                        onChange={(e) => setSitemapContent(e.target.value)}
                        placeholder="<?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?>&#10;<urlset xmlns=&quot;http://www.sitemaps.org/schemas/sitemap/0.9&quot;>&#10;  <url>&#10;    <loc>https://example.com/</loc>&#10;  </url>&#10;</urlset>"
                        required
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Paste your sitemap XML content here
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Validating...' : 'Validate Sitemap'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {result.is_valid ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-green-900">Valid Sitemap</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-600 mr-2" />
                        <span className="text-red-900">Invalid Sitemap</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{result.url_count}</p>
                      <p className="text-sm text-gray-600">URLs</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{result.errors.length}</p>
                      <p className="text-sm text-gray-600">Errors</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{result.warnings.length}</p>
                      <p className="text-sm text-gray-600">Warnings</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>File Size: <span className="font-semibold">{result.total_size_mb} MB</span></p>
                    <p>Validated: {new Date(result.validated_at).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {result.errors.length > 0 && (
                <Card className="mb-6 border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-900">
                      <XCircle className="w-5 h-5 mr-2" />
                      Errors ({result.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.errors.map((err, index) => (
                        <li key={index} className="text-sm text-red-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {result.warnings.length > 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-900">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Warnings ({result.warnings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-orange-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {result.urls.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>URL Preview (first 100)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Change Freq
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Last Modified
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.urls.map((url, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                                {url.loc}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {url.priority || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {url.changefreq || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {url.lastmod || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
