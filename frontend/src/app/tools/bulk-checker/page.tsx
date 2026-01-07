'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Trash2,
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  User,
  Server,
  Shield,
  Sparkles,
  AlertTriangle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ValidationResult {
  email: string;
  is_valid: boolean;
  is_valid_syntax: boolean;
  is_valid_dns: boolean;
  is_valid_smtp: boolean;
  is_disposable: boolean;
  domain: string;
  error?: string;
}

export default function BulkCheckerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [emails, setEmails] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setCredits(data.profile?.credits_remaining || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ['text/plain', 'text/csv', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt') && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a .txt or .csv file');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEmails(content);
    };
    reader.readAsText(selectedFile);
  };

  const handleBulkValidation = async () => {
    setError('');
    setResults([]);

    // Parse emails
    const emailList = emails
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emailList.length === 0) {
      setError('Please provide at least one email address');
      return;
    }

    if (emailList.length > credits) {
      setError(`Not enough credits. You need ${emailList.length} credits but only have ${credits} remaining.`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const validationResults: ValidationResult[] = [];

      // Validate each email (without saving to database)
      for (const email of emailList) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/bulk-validate/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (response.ok) {
            validationResults.push({
              email,
              is_valid: data.is_valid,
              is_valid_syntax: data.is_valid_syntax,
              is_valid_dns: data.is_valid_dns,
              is_valid_smtp: data.is_valid_smtp,
              is_disposable: data.is_disposable,
              domain: data.domain,
            });
          } else {
            validationResults.push({
              email,
              is_valid: false,
              is_valid_syntax: false,
              is_valid_dns: false,
              is_valid_smtp: false,
              is_disposable: false,
              domain: '',
              error: data.error || 'Validation failed',
            });
          }
        } catch (err) {
          validationResults.push({
            email,
            is_valid: false,
            is_valid_syntax: false,
            is_valid_dns: false,
            is_valid_smtp: false,
            is_disposable: false,
            domain: '',
            error: 'Network error',
          });
        }
      }

      setResults(validationResults);

      // Refresh credits
      await fetchUserProfile(token!);
    } catch (err: any) {
      setError(err.message || 'Bulk validation failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

    const csvContent = [
      ['Email', 'Valid', 'Syntax', 'DNS', 'SMTP', 'Disposable', 'Domain', 'Error'].join(','),
      ...results.map(r => [
        r.email,
        r.is_valid ? 'Yes' : 'No',
        r.is_valid_syntax ? 'Yes' : 'No',
        r.is_valid_dns ? 'Yes' : 'No',
        r.is_valid_smtp ? 'Yes' : 'No',
        r.is_disposable ? 'Yes' : 'No',
        r.domain,
        r.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-validation-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setEmails('');
    setFile(null);
    setResults([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = results.filter(r => r.is_valid).length;
  const invalidCount = results.length - validCount;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

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
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bulk Email Checker</h1>
                <p className="text-gray-600 mt-1">
                  Upload CSV/TXT file or paste emails to validate in bulk
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-6 py-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500">Available Credits</p>
                    <p className="text-2xl font-bold text-gray-900">{credits}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Upload Method Selector */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                uploadMethod === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              Upload File
            </button>
            <button
              onClick={() => setUploadMethod('paste')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                uploadMethod === 'paste'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Paste Emails
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {uploadMethod === 'file' ? 'Upload Email List' : 'Paste Email Addresses'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadMethod === 'file' ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    CSV or TXT file (one email per line)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="Enter email addresses (one per line or comma-separated)&#10;&#10;Example:&#10;user1@example.com&#10;user2@example.com&#10;user3@example.com"
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {emails.split(/[\n,;]/).filter(e => e.trim().length > 0).length} email(s) detected
                </p>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleBulkValidation}
                isLoading={loading}
                disabled={!emails.trim() || loading}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Validate Emails
              </Button>
              <Button
                onClick={clearAll}
                variant="outline"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Validation Results</CardTitle>
                <Button onClick={downloadCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                  <p className="text-sm text-gray-600">Total Checked</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{validCount}</p>
                  <p className="text-sm text-gray-600">Valid Emails</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
                  <p className="text-sm text-gray-600">Invalid Emails</p>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Syntax</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">DNS</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">SMTP</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Disposable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono">{result.email}</td>
                        <td className="py-3 px-4 text-center">
                          {result.is_valid ? (
                            <CheckCircle className="w-5 h-5 text-green-600 inline-block" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 inline-block" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.is_valid_syntax ? '✓' : '✗'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.is_valid_dns ? '✓' : '✗'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.is_valid_smtp ? '✓' : '✗'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.is_disposable ? (
                            <span className="text-red-600">Yes</span>
                          ) : (
                            <span className="text-green-600">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {results.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload or Paste</h3>
                    <p className="text-sm text-gray-600">
                      Upload a CSV/TXT file or paste email addresses directly
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Validate</h3>
                    <p className="text-sm text-gray-600">
                      Each email is validated for syntax, DNS, SMTP, and disposable detection
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Export Results</h3>
                    <p className="text-sm text-gray-600">
                      Download your results as a CSV file for further processing
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-900">
                    <strong>💡 Pricing:</strong> 1 credit = 1 email validation.
                    New users get 100 free credits!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
