'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAppUrl } from '@/lib/config';
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
  Search,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface MXRecord {
  priority: number;
  host: string;
  exchange: string;
}

interface MXLookupResult {
  domain: string;
  mx_records: MXRecord[];
  has_mx: boolean;
  mx_count: number;
  a_records?: string[];
  checked_at: string;
  error?: string;
}

export default function MXLookupPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MXLookupResult | null>(null);
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

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/mx-lookup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'MX lookup failed');
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
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sugesto
            </h1>
          </Link>
        </div>

        {/* User Info */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <Link
            href={getAppUrl("/dashboard")}
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
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
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
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
              href={getAppUrl("/dashboard/settings")}
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">MX Record Lookup</h1>
            <p className="text-gray-600 mt-1">Check mail exchange records for any domain</p>
          </div>

          {/* Info Card */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Tool - No Credits Required</p>
                  <p className="text-blue-700">MX records determine where emails for a domain should be delivered. Lower priority numbers indicate higher priority servers.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lookup Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Domain Name</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <Input
                  label="Domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  required
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Lookup MX Records
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <>
              {/* Summary Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Lookup Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Domain */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Domain</p>
                    <p className="text-lg font-semibold text-gray-900">{result.domain}</p>
                  </div>

                  {/* Status */}
                  <div className={`p-4 rounded-lg border-2 ${
                    result.has_mx
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {result.has_mx ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className={`font-semibold ${
                          result.has_mx ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {result.has_mx ? `${result.mx_count} MX Record(s) Found` : 'No MX Records Found'}
                        </p>
                        <p className={`text-sm ${
                          result.has_mx ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.has_mx
                            ? 'This domain is configured to receive emails'
                            : 'This domain cannot receive emails'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checked At */}
                  <div className="text-xs text-gray-500">
                    Checked at: {new Date(result.checked_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              {/* MX Records Table */}
              {result.mx_records && result.mx_records.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>MX Records Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Mail Server</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.mx_records.map((record, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {record.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-sm text-gray-900">
                                {record.host}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Note:</strong> Lower priority numbers indicate higher priority.
                        Email servers will attempt delivery to the lowest priority number first.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* A Records */}
              {result.a_records && result.a_records.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>A Records (IP Addresses)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.a_records.map((ip, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                          {ip}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
