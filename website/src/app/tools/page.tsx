import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Mail, Globe, FileText, AlertTriangle, Server, Sparkles, Search, CheckCircle, Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Free Email Validation & SEO Tools - Sugesto',
  description: 'Comprehensive suite of free email validation, email security, and SEO tools. Validate emails, check MX records, analyze Chrome extensions, validate sitemaps, and more.',
};

export default function ToolsPage() {
  const tools = [
    {
      name: 'Email Validator',
      description: 'Comprehensive email validation with syntax, DNS, SMTP checks',
      icon: Mail,
      href: '/tools/email-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'Email Validation',
      badge: 'Try Free',
    },
    {
      name: 'Bulk Email Checker',
      description: 'Validate multiple email addresses at once with CSV export',
      icon: Mail,
      href: '/tools/bulk-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'Email Validation',
      badge: 'Try Free',
    },
    {
      name: 'MX Lookup',
      description: 'Check mail exchange records and DNS configuration for domains',
      icon: Server,
      href: '/tools/mx-lookup',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'Email Validation',
      badge: 'Try Free',
    },
    {
      name: 'Role Account Detector',
      description: 'Identify generic role-based email addresses vs personal accounts',
      icon: Shield,
      href: '/tools/role-detector',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'Email Validation',
      badge: 'Try Free',
    },
    {
      name: 'List Cleaner',
      description: 'Remove duplicates and invalid emails from your mailing lists',
      icon: Sparkles,
      href: '/tools/list-cleaner',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'Email Validation',
      badge: 'Try Free',
    },
    {
      name: 'SPF Generator',
      description: 'Generate SPF records for your domain with custom configuration',
      icon: Shield,
      href: '/tools/spf-generator',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'Email Security',
      badge: 'Try Free',
    },
    {
      name: 'Blacklist Checker',
      description: 'Check if your domain or IP is listed on email blacklists',
      icon: AlertTriangle,
      href: '/tools/blacklist-checker',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'Email Security',
      badge: 'Try Free',
    },
    {
      name: 'Sitemap Validator',
      description: 'Validate your XML sitemap structure and check for errors',
      icon: CheckCircle,
      href: '/tools/sitemap-validator',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      category: 'SEO Tools',
      badge: 'Try Free',
    },
    {
      name: 'Sitemap Finder',
      description: 'Discover sitemaps for any website automatically',
      icon: Search,
      href: '/tools/sitemap-finder',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      category: 'SEO Tools',
      badge: 'Try Free',
    },
    {
      name: 'Chrome Extensions Analyzer',
      description: 'Analyze Chrome extensions for security, permissions, and privacy risks',
      icon: Puzzle,
      href: '/tools/chrome-extensions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'SEO Tools',
      badge: 'New',
    },
    {
      name: 'AI Content Generator',
      description: 'Generate marketing content with AI for products, social media, and emails',
      icon: Sparkles,
      href: '/tools/content-generator',
      color: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      category: 'Marketing',
      badge: 'New',
    },
  ];

  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">All Tools Free Forever</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Professional Email &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SEO Tools
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive suite of tools for email validation, security checks, and SEO optimization.
            All tools are free to use with no registration required.
          </p>
        </div>
      </section>

      {/* Tools Grid by Category */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.name} href={tool.href}>
                      <Card hover className="h-full transition-all duration-200 hover:scale-105">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                              <Icon className={`w-6 h-6 ${tool.color}`} />
                            </div>
                            <Badge variant="info">{tool.badge}</Badge>
                          </div>
                          <CardTitle>{tool.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{tool.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
