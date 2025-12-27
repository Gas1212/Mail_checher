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
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ValidationResult {
  email: string;
  is_valid: boolean;
  is_valid_syntax: boolean;
  is_valid_dns: boolean;
  is_valid_smtp: boolean;
  is_disposable: boolean;
  domain: string;
  mx_records: string[];
  validation_message: string;
  details: any;
}

export default function EmailCheckerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
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

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/bulk-validate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, check_smtp: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your account.');
        }
        throw new Error(data.error || 'Validation failed');
      }

      setResult(data);

      // Refresh profile to update credits
      await fetchUserProfile(token!);
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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mail Checker
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
              <p className="text-xs text-gray-500 truncate">{profile?.plan_type || 'Free'} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/tools/email-checker"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
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
            href="/dashboard/settings"
            className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
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
            <h1 className="text-3xl font-bold text-gray-900">Single Email Validator</h1>
            <p className="text-gray-600 mt-1">Validate individual email addresses with detailed results</p>
          </div>

          {/* Credits Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Available Credits</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">
                  {profile?.credits_remaining || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Validation Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Email Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleValidate} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  required
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full">
                  Validate Email (1 Credit)
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{result.email}</p>
                </div>

                {/* Overall Status */}
                <div className={`p-4 rounded-lg border-2 ${
                  result.is_valid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {result.is_valid ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        result.is_valid ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.is_valid ? 'Valid Email' : 'Invalid Email'}
                      </p>
                      <p className={`text-sm ${
                        result.is_valid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.validation_message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Checks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Syntax Check */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.is_valid_syntax ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900">Syntax Check</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.is_valid_syntax ? 'Valid format' : 'Invalid format'}
                    </p>
                  </div>

                  {/* DNS Check */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.is_valid_dns ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900">DNS Check</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.is_valid_dns ? 'Domain exists' : 'Domain not found'}
                    </p>
                  </div>

                  {/* SMTP Check */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.is_valid_smtp ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-900">SMTP Check</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.is_valid_smtp ? 'Mailbox verified' : 'Not verified'}
                    </p>
                  </div>

                  {/* Disposable Check */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.is_disposable ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-medium text-gray-900">Disposable Check</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.is_disposable ? 'Disposable email' : 'Not disposable'}
                    </p>
                  </div>
                </div>

                {/* Domain Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Domain Information</p>
                  <p className="text-gray-900 mb-3">{result.domain}</p>

                  {result.mx_records && result.mx_records.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-gray-700 mb-2">MX Records</p>
                      <ul className="space-y-1">
                        {result.mx_records.map((mx, index) => (
                          <li key={index} className="text-sm text-gray-600 font-mono">
                            {mx}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
