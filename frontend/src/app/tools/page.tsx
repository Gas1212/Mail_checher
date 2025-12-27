'use client';

import Link from 'next/link';
import { Shield, Mail, Globe, FileText, AlertTriangle, FileType } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ToolsPage() {
  const tools = [
    {
      name: 'Email Validator',
      description: 'Comprehensive email validation with syntax, DNS, SMTP checks',
      icon: Mail,
      href: '/tools/email-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      name: 'SPF Checker',
      description: 'Validate SPF records and email authentication configuration',
      icon: Shield,
      href: '/tools/spf-checker',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'DMARC Checker',
      description: 'Check DMARC policies and email security settings',
      icon: Mail,
      href: '/tools/dmarc-checker',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'DNS Lookup',
      description: 'Perform comprehensive DNS record lookups for any domain',
      icon: Globe,
      href: '/tools/dns-checker',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Header Analyzer',
      description: 'Analyze email headers for security threats and authentication',
      icon: FileText,
      href: '/tools/header-analyzer',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Phishing Checker',
      description: 'Detect potential phishing URLs and security threats',
      icon: AlertTriangle,
      href: '/tools/phishing-checker',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'TXT Record Checker',
      description: 'Check TXT records including SPF, DMARC, and DKIM',
      icon: FileType,
      href: '/tools/txt-checker',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Email Security Tools</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of tools to validate email authentication, check DNS records,
              and protect against phishing attacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.name} href={tool.href} className="block group">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                      <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our security tools help you validate email authentication, analyze headers,
                and protect against phishing attacks. Each tool provides detailed analysis
                and actionable recommendations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
