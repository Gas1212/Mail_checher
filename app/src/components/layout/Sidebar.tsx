'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Search
} from 'lucide-react';

interface SidebarProps {
  user: any;
  profile: any;
  onLogout: () => void;
}

export default function Sidebar({ user, profile, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
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
            <p className="text-xs text-gray-500 truncate">{profile?.plan_type || 'Free'} Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
            isActive('/dashboard')
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
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
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/email-checker')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Single Checker</span>
            </Link>
            <Link
              href="/tools/bulk-checker"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/bulk-checker')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Bulk Checker</span>
            </Link>
            <Link
              href="/tools/mx-lookup"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/mx-lookup')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Server className="w-5 h-5" />
              <span>MX Lookup</span>
            </Link>
            <Link
              href="/tools/role-detector"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/role-detector')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Role Detector</span>
            </Link>
            <Link
              href="/tools/list-cleaner"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/list-cleaner')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/spf-generator')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>SPF Generator</span>
            </Link>
            <Link
              href="/tools/blacklist-checker"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/blacklist-checker')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/sitemap-validator')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Sitemap Validator</span>
            </Link>
            <Link
              href="/tools/sitemap-finder"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/sitemap-finder')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Sitemap Finder</span>
            </Link>
          </div>
        </div>

        {/* Marketing Category */}
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Marketing
          </div>
          <div className="space-y-1 mt-1">
            <Link
              href="/tools/content-generator"
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/tools/content-generator')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Content Generator</span>
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div className="pt-2 border-t border-gray-200">
          <Link
            href="/dashboard/settings"
            className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/dashboard/settings')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
