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
  Download,
  Trash2,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CleanListResult {
  cleaned_emails: string[];
  duplicates: string[];
  invalid: string[];
  stats: {
    total_input: number;
    duplicates_removed: number;
    invalid_removed: number;
    valid_unique: number;
  };
}

export default function ListCleanerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanListResult | null>(null);
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

  const handleClean = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const emailList = emails.split('\n').filter(e => e.trim());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/clean-list/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: emailList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cleaning failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCleanList = () => {
    if (!result) return;

    const csvContent = result.cleaned_emails.join('\n');
    const blob = new Blob([csvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned-emails-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/tools/email-checker" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Mail className="w-5 h-5" />
            <span>Single Checker</span>
          </Link>
          <Link href="/tools/bulk-checker" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Mail className="w-5 h-5" />
            <span>Bulk Checker</span>
          </Link>
          <Link href="/tools/mx-lookup" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Server className="w-5 h-5" />
            <span>MX Lookup</span>
          </Link>
          <Link href="/tools/role-detector" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Shield className="w-5 h-5" />
            <span>Role Detector</span>
          </Link>
          <Link href="/tools/list-cleaner" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <span>List Cleaner</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
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
            <h1 className="text-3xl font-bold text-gray-900">List Cleaner & Deduplicator</h1>
            <p className="text-gray-600 mt-1">Clean your email lists by removing duplicates and invalid addresses</p>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Tool - No Credits Required</p>
                  <p className="text-blue-700">Automatically remove duplicates, normalize formatting, and filter out invalid email addresses from your lists.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Paste Your Email List</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClean} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses (one per line)
                  </label>
                  <textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="john@example.com&#10;JOHN@EXAMPLE.COM&#10;jane@example.com&#10;invalid-email&#10;support@example.com"
                    rows={12}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Paste your email list here. Each email should be on a new line.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button type="submit" isLoading={loading} className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Clean & Deduplicate
                  </Button>
                  {result && (
                    <Button type="button" onClick={downloadCleanList} variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Clean List
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <>
              {/* Statistics */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Cleaning Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{result.stats.total_input}</p>
                      <p className="text-sm text-gray-600">Total Input</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{result.stats.valid_unique}</p>
                      <p className="text-sm text-gray-600">Clean Emails</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">{result.stats.duplicates_removed}</p>
                      <p className="text-sm text-gray-600">Duplicates</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">{result.stats.invalid_removed}</p>
                      <p className="text-sm text-gray-600">Invalid</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clean Emails */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Clean Email List ({result.cleaned_emails.length})</CardTitle>
                    <Button onClick={downloadCleanList} variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 font-mono text-sm">
                    {result.cleaned_emails.map((email, index) => (
                      <div key={index} className="py-1 text-gray-700">
                        {email}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Duplicates */}
              {result.duplicates.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Duplicates Removed ({result.duplicates.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto bg-orange-50 rounded-lg p-4 font-mono text-sm">
                      {result.duplicates.map((email, index) => (
                        <div key={index} className="py-1 text-orange-700">
                          {email}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invalid */}
              {result.invalid.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Invalid Emails Removed ({result.invalid.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto bg-red-50 rounded-lg p-4 font-mono text-sm">
                      {result.invalid.map((email, index) => (
                        <div key={index} className="py-1 text-red-700">
                          {email}
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
