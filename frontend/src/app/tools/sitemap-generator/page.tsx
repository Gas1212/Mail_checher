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
  Plus,
  Trash2,
  Download,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface URLEntry {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

interface SitemapResult {
  sitemap: string;
  url_count: number;
  generated_at: string;
  download_instructions: string[];
}

export default function SitemapGenerator() {
  const [domain, setDomain] = useState('');
  const [urls, setUrls] = useState<URLEntry[]>([
    { loc: '', priority: '1.0', changefreq: 'daily' }
  ]);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddUrl = () => {
    setUrls([...urls, { loc: '', priority: '0.8', changefreq: 'weekly' }]);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length > 0 ? newUrls : [{ loc: '', priority: '1.0', changefreq: 'daily' }]);
  };

  const handleUrlChange = (index: number, field: keyof URLEntry, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Filter out empty URLs
      const validUrls = urls.filter(url => url.loc.trim());

      if (validUrls.length === 0) {
        setError('Please add at least one URL');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/generate-sitemap/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          urls: validUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sitemap');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating sitemap');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.sitemap);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result) {
      const blob = new Blob([result.sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
          >
            <FileText className="w-5 h-5" />
            <span>Sitemap Generator</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap Generator</h1>
            <p className="text-gray-600">Generate XML sitemaps for your website</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generate Sitemap</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain (optional)
                  </label>
                  <Input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">URLs</label>
                    <Button
                      type="button"
                      onClick={handleAddUrl}
                      className="flex items-center gap-2 text-sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                      Add URL
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {urls.map((url, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              URL *
                            </label>
                            <Input
                              type="url"
                              value={url.loc}
                              onChange={(e) => handleUrlChange(index, 'loc', e.target.value)}
                              placeholder="https://example.com/page"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Priority (0.0 - 1.0)
                            </label>
                            <select
                              value={url.priority}
                              onChange={(e) => handleUrlChange(index, 'priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="1.0">1.0 - Highest</option>
                              <option value="0.9">0.9</option>
                              <option value="0.8">0.8</option>
                              <option value="0.7">0.7</option>
                              <option value="0.6">0.6</option>
                              <option value="0.5">0.5 - Medium</option>
                              <option value="0.4">0.4</option>
                              <option value="0.3">0.3</option>
                              <option value="0.2">0.2</option>
                              <option value="0.1">0.1 - Lowest</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Change Frequency
                            </label>
                            <select
                              value={url.changefreq}
                              onChange={(e) => handleUrlChange(index, 'changefreq', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="always">Always</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="never">Never</option>
                            </select>
                          </div>
                        </div>

                        {urls.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => handleRemoveUrl(index)}
                            variant="outline"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate Sitemap'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Sitemap</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleDownload}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg font-mono text-xs overflow-x-auto max-h-96">
                    <pre>{result.sitemap}</pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Total URLs: <span className="font-semibold">{result.url_count}</span></p>
                    <p>Generated: {new Date(result.generated_at).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Installation Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {result.download_instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="font-medium mr-2 text-indigo-600">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
