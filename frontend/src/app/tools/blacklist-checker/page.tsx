'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  User,
  Server,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface BlacklistResult {
  name: string;
  host: string;
  type: string;
  listed: boolean;
  checked: boolean;
  error?: string;
}

interface BlacklistCheckResult {
  domain?: string;
  ip?: string;
  results: BlacklistResult[];
  stats: {
    total_checked: number;
    listed_count: number;
    clean_count: number;
  };
  recommendation: string;
  checked_at: string;
}

export default function BlacklistCheckerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkType, setCheckType] = useState<'domain' | 'ip'>('domain');
  const [domain, setDomain] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BlacklistCheckResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/check-blacklist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          checkType === 'domain' ? { domain } : { ip: ipAddress }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Blacklist check failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
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

  if (!user) {
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mail Checker
            </h1>
          </Link>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.first_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Email Validation Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Validation
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/email-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-5 h-5" />
                <span>Single Checker</span>
              </Link>
              <Link
                href="/tools/bulk-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-5 h-5" />
                <span>Bulk Checker</span>
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
            </div>
          </div>

          {/* Email Security Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Security
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/spf-generator"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-5 h-5" />
                <span>SPF Generator</span>
              </Link>
              <Link
                href="/tools/blacklist-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Blacklist Checker</span>
              </Link>
            </div>
          </div>

          {/* SEO Tools Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SEO Tools
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/sitemap-validator"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Sitemap Validator</span>
              </Link>
              <Link
                href="/tools/sitemap-finder"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
                <span>Sitemap Finder</span>
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="pt-2 border-t border-gray-200">
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Blacklist Checker</h1>
            <p className="text-gray-600 mt-1">Check if your domain or IP is listed on spam blacklists</p>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Tool - No Credits Required</p>
                  <p className="text-blue-700">Being listed on blacklists can severely impact email deliverability. We check 7 major blacklist providers including Spamhaus, Spamcop, and SORBS.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setCheckType('domain')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                checkType === 'domain' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Check Domain
            </button>
            <button
              onClick={() => setCheckType('ip')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                checkType === 'ip' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Check IP Address
            </button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{checkType === 'domain' ? 'Enter Domain' : 'Enter IP Address'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheck} className="space-y-4">
                {checkType === 'domain' ? (
                  <Input
                    label="Domain"
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    required
                  />
                ) : (
                  <Input
                    label="IP Address"
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.1"
                    required
                  />
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Check Blacklists
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Check Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Checked {checkType === 'domain' ? 'Domain' : 'IP Address'}</p>
                      <p className="text-lg font-semibold text-gray-900">{result.domain || result.ip}</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${
                      result.stats.listed_count === 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {result.stats.listed_count === 0 ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <div>
                          <p className={`font-semibold ${
                            result.stats.listed_count === 0 ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {result.stats.listed_count === 0 ? 'Clean - Not Listed' : `Listed on ${result.stats.listed_count} Blacklist(s)`}
                          </p>
                          <p className={`text-sm ${
                            result.stats.listed_count === 0 ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{result.stats.total_checked}</p>
                        <p className="text-sm text-gray-600">Checked</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600">{result.stats.listed_count}</p>
                        <p className="text-sm text-gray-600">Listed</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{result.stats.clean_count}</p>
                        <p className="text-sm text-gray-600">Clean</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Checked at: {new Date(result.checked_at).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blacklist Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Blacklist</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.results.map((bl, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{bl.name}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {bl.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {bl.checked ? (
                                bl.listed ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Listed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Clean
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Error
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {result.stats.listed_count > 0 && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-900 mb-2">
                        What to do if you&apos;re listed:
                      </p>
                      <ul className="space-y-1 text-sm text-orange-800">
                        <li>• Review your email sending practices</li>
                        <li>• Check for compromised accounts or systems</li>
                        <li>• Request delisting from each blacklist provider</li>
                        <li>• Implement proper email authentication (SPF, DKIM, DMARC)</li>
                        <li>• Monitor your sender reputation regularly</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
