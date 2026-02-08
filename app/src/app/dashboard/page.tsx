'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  TrendingUp,
  CreditCard,
  User,
  Server,
  Shield,
  Sparkles,
  AlertTriangle,
  FileText,
  CheckCircle,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch user profile
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

  if (loading) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-12 sm:h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 z-50">
        <Link href="/">
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sugesto
          </h1>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex pt-12 sm:pt-14 lg:pt-0">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-12 sm:top-14 lg:top-0 left-0 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] lg:h-screen w-56 sm:w-60 lg:w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo - Hidden on mobile (shown in mobile header instead) */}
        <div className="hidden lg:block p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sugesto
            </h1>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {user?.first_name || user?.email}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">{profile?.plan_type || 'Free'} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2 lg:space-y-3 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
          >
            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Email Validation Category */}
          <div>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Validation
            </div>
            <div className="space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1">
              <Link
                href="/tools/email-checker"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Single Checker</span>
              </Link>
              <Link
                href="/tools/bulk-checker"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Bulk Checker</span>
              </Link>
              <Link
                href="/tools/mx-lookup"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Server className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>MX Lookup</span>
              </Link>
              <Link
                href="/tools/role-detector"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Role Detector</span>
              </Link>
              <Link
                href="/tools/list-cleaner"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>List Cleaner</span>
              </Link>
            </div>
          </div>

          {/* Email Security Category */}
          <div>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Security
            </div>
            <div className="space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1">
              <Link
                href="/tools/spf-generator"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>SPF Generator</span>
              </Link>
              <Link
                href="/tools/blacklist-checker"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Blacklist Checker</span>
              </Link>
            </div>
          </div>

          {/* SEO Tools Category */}
          <div>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SEO Tools
            </div>
            <div className="space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1">
              <Link
                href="/tools/sitemap-validator"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sitemap Validator</span>
              </Link>
              <Link
                href="/tools/sitemap-finder"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sitemap Finder</span>
              </Link>
            </div>
          </div>

          {/* Marketing Category */}
          <div>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Marketing
            </div>
            <div className="space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1">
              <Link
                href="/tools/content-generator"
                className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>AI Content Generator</span>
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="pt-2 border-t border-gray-200">
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name || 'User'}!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">Here&apos;s what&apos;s happening with your account</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Credits Remaining
                  </CardTitle>
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile?.credits_remaining || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  {profile?.credits_used || 0} used this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Checks
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile?.total_checks || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                    This Month
                  </CardTitle>
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile?.checks_this_month || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Email validations</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <Link
                  href="/tools/email-checker"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Single Email Checker</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Validate individual email addresses</p>
                </Link>

                <Link
                  href="/tools/bulk-checker"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Bulk Email Checker</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Validate multiple emails at once</p>
                </Link>

                <Link
                  href="/tools/mx-lookup"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Server className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">MX Lookup</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Check mail exchange records</p>
                </Link>

                <Link
                  href="/tools/role-detector"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Role Detector</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Identify generic role accounts</p>
                </Link>

                <Link
                  href="/tools/list-cleaner"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">List Cleaner</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Remove duplicates and invalid emails</p>
                </Link>

                <Link
                  href="/tools/content-generator"
                  className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-fuchsia-300 hover:bg-fuchsia-50 transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-600 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">AI Content Generator</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Generate marketing content with AI</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </div>
  );
}
