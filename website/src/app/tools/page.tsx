'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Globe, FileText, AlertTriangle, Server, Sparkles, Search, CheckCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getAppUrl } from '@/lib/config';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: { name: 'All Tools', icon: Globe },
    email: { name: 'Email Validation', icon: Mail },
    security: { name: 'Email Security', icon: Shield },
    seo: { name: 'SEO Tools', icon: Search },
  };

  const tools = [
    {
      name: 'Email Validator',
      description: 'Comprehensive email validation with syntax, DNS, SMTP checks',
      icon: Mail,
      href: '/tools/email-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'email',
      badge: 'Try Free',
    },
    {
      name: 'Bulk Email Checker',
      description: 'Validate multiple email addresses at once with CSV export',
      icon: Mail,
      href: '/tools/bulk-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'email',
      badge: 'Try Free',
    },
    {
      name: 'MX Lookup',
      description: 'Check mail exchange records and DNS configuration for domains',
      icon: Server,
      href: '/tools/mx-lookup',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'email',
      badge: 'Try Free',
    },
    {
      name: 'Role Account Detector',
      description: 'Identify generic role-based email addresses vs personal accounts',
      icon: Shield,
      href: '/tools/role-detector',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'email',
      badge: 'Try Free',
    },
    {
      name: 'List Cleaner',
      description: 'Remove duplicates and invalid emails from your mailing lists',
      icon: Sparkles,
      href: '/tools/list-cleaner',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'email',
      badge: 'Try Free',
    },
    {
      name: 'SPF Generator',
      description: 'Generate SPF records for your domain with custom configuration',
      icon: Shield,
      href: '/tools/spf-generator',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'security',
      badge: 'Try Free',
    },
    {
      name: 'Blacklist Checker',
      description: 'Check if your domain or IP is listed on spam blacklists',
      icon: AlertTriangle,
      href: '/tools/blacklist-checker',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'security',
      badge: 'Try Free',
    },
    {
      name: 'Sitemap Validator',
      description: 'Validate your XML sitemap for errors and best practices',
      icon: CheckCircle,
      href: getAppUrl('/tools/sitemap-validator'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'seo',
    },
    {
      name: 'Sitemap Finder',
      description: 'Find and analyze sitemaps for any domain',
      icon: Search,
      href: getAppUrl('/tools/sitemap-finder'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'seo',
    },
  ];

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional email validation, security, and SEO tools to enhance your workflow
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              {Object.entries(categories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${selectedCategory === key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.name} href={tool.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group relative">
                    {tool.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="success" className="text-xs px-2 py-1">
                          {tool.badge}
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                        Try it now
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tools found in this category</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
