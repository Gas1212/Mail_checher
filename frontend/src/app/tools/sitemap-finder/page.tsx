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
  Search,
  ExternalLink,
  Globe,
  FileCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Sitemap {
  url: string;
  source: string;
  status: string;
  status_code?: number;
  type?: string;
  url_count?: number;
  sitemap_count?: number;
  size_bytes?: number;
  size_mb?: number;
  last_modified?: string;
  error?: string;
}

interface FinderResult {
  found: boolean;
  domain: string;
  sitemaps: Sitemap[];
  sitemap_count?: number;
  errors: string[];
  checked_at: string;
  recommendations: string[];
}

export default function SitemapFinder() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<FinderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/find-sitemap/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find sitemaps');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while finding sitemaps');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accessible':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Accessible
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getTypeBadge = (type?: string) => {
    if (!type) return null;

    switch (type) {
      case 'sitemap_index':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Sitemap Index
          </span>
        );
      case 'urlset':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            URL Set
          </span>
        );
      case 'invalid_xml':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Invalid XML
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {type}
          </span>
        );
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
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Sitemap Validator</span>
          </Link>

          <Link
            href="/tools/sitemap-finder"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
          >
            <Search className="w-5 h-5" />
            <span>Sitemap Finder</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap Finder</h1>
            <p className="text-gray-600">Find and analyze sitemaps for any domain</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find Sitemaps</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFind} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <Input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com or https://example.com"
                    required
                    className="w-full"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Enter a domain name. We&apos;ll check robots.txt and common sitemap locations.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Searching...' : 'Find Sitemaps'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {result.found ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-green-900">Sitemaps Found</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-6 h-6 text-gray-600 mr-2" />
                        <span className="text-gray-900">No Sitemaps Found</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Domain:</span>
                      <span className="ml-2 font-medium text-gray-900">{result.domain}</span>
                    </div>
                    {result.sitemap_count !== undefined && (
                      <div className="flex items-center text-sm">
                        <FileCode className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Sitemaps Found:</span>
                        <span className="ml-2 font-medium text-gray-900">{result.sitemap_count}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Checked: {new Date(result.checked_at).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.sitemaps && result.sitemaps.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Sitemaps ({result.sitemaps.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.sitemaps.map((sitemap, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <a
                                href={sitemap.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                {sitemap.url}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                              <p className="text-xs text-gray-500 mt-1">
                                Found in: {sitemap.source}
                              </p>
                            </div>
                            <div className="ml-4 flex gap-2">
                              {getStatusBadge(sitemap.status)}
                              {getTypeBadge(sitemap.type)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {sitemap.url_count !== undefined && (
                              <div>
                                <span className="text-gray-500">URLs:</span>
                                <span className="ml-1 font-medium text-gray-900">
                                  {sitemap.url_count}
                                </span>
                              </div>
                            )}
                            {sitemap.sitemap_count !== undefined && (
                              <div>
                                <span className="text-gray-500">Sitemaps:</span>
                                <span className="ml-1 font-medium text-gray-900">
                                  {sitemap.sitemap_count}
                                </span>
                              </div>
                            )}
                            {sitemap.size_mb !== undefined && (
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <span className="ml-1 font-medium text-gray-900">
                                  {sitemap.size_mb} MB
                                </span>
                              </div>
                            )}
                            {sitemap.status_code !== undefined && (
                              <div>
                                <span className="text-gray-500">Status:</span>
                                <span className="ml-1 font-medium text-gray-900">
                                  {sitemap.status_code}
                                </span>
                              </div>
                            )}
                          </div>

                          {sitemap.last_modified && (
                            <div className="mt-2 text-xs text-gray-500">
                              Last modified: {sitemap.last_modified}
                            </div>
                          )}

                          {sitemap.error && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-800">
                              Error: {sitemap.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.errors.length > 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-900">
                      Issues Encountered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.errors.map((err, index) => (
                        <li key={index} className="text-sm text-orange-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
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
