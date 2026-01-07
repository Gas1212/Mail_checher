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
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface RoleDetectionResult {
  email: string;
  is_role_account: boolean;
  confidence: number;
  detected_role: string | null;
  type: string;
  error?: string;
}

interface BulkRoleDetectionResult {
  results: RoleDetectionResult[];
  stats: {
    total: number;
    role_accounts: number;
    personal_accounts: number;
  };
}

export default function RoleDetectorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState('');
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoleDetectionResult | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkRoleDetectionResult | null>(null);
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

  const handleDetect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setBulkResult(null);

    try {
      const body = mode === 'single'
        ? { email }
        : { emails: emails.split('\n').filter(e => e.trim()) };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/detect-role-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Detection failed');
      }

      if (mode === 'single') {
        setResult(data);
      } else {
        setBulkResult(data);
      }
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
              Sugesto
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
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
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
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
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
            <h1 className="text-3xl font-bold text-gray-900">Role Account Detector</h1>
            <p className="text-gray-600 mt-1">Identify generic role-based email addresses</p>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Tool - No Credits Required</p>
                  <p className="text-blue-700">Role accounts (info@, support@, admin@) are generic emails typically managed by teams, not individuals. Filter these out to improve your marketing targeting.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mode Selector */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'single' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Single Email
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'bulk' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Bulk Detection
            </button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{mode === 'single' ? 'Enter Email Address' : 'Enter Email Addresses'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDetect} className="space-y-4">
                {mode === 'single' ? (
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@example.com"
                    required
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses (one per line)
                    </label>
                    <textarea
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      placeholder="info@example.com&#10;support@example.com&#10;john@example.com"
                      rows={8}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Detect Role Accounts
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Single Result */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Detection Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{result.email}</p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  result.is_role_account ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {result.is_role_account ? (
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        result.is_role_account ? 'text-orange-900' : 'text-green-900'
                      }`}>
                        {result.is_role_account ? 'Role Account Detected' : 'Personal Account'}
                      </p>
                      <p className={`text-sm ${
                        result.is_role_account ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {result.is_role_account
                          ? `Generic role: ${result.detected_role} (${result.confidence}% confidence)`
                          : 'This appears to be a personal email address'}
                      </p>
                    </div>
                  </div>
                </div>

                {result.is_role_account && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Detected Role</p>
                        <p className="font-medium text-gray-900">{result.detected_role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{result.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="font-medium text-gray-900">{result.confidence}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bulk Results */}
          {bulkResult && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Detection Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{bulkResult.stats.total}</p>
                      <p className="text-sm text-gray-600">Total Emails</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">{bulkResult.stats.role_accounts}</p>
                      <p className="text-sm text-gray-600">Role Accounts</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{bulkResult.stats.personal_accounts}</p>
                      <p className="text-sm text-gray-600">Personal Accounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkResult.results.map((r, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-mono">{r.email}</td>
                            <td className="px-4 py-3">
                              {r.is_role_account ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Role Account
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Personal
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">{r.detected_role || '-'}</td>
                            <td className="px-4 py-3 text-sm">{r.confidence > 0 ? `${r.confidence}%` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
