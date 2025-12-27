'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Shield, Mail, Globe, FileText, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import SPFChecker from '@/components/tools/SPFChecker';
import DMARCChecker from '@/components/tools/DMARCChecker';
import DNSChecker from '@/components/tools/DNSChecker';
import HeaderAnalyzer from '@/components/tools/HeaderAnalyzer';
import PhishingChecker from '@/components/tools/PhishingChecker';

export default function ToolsPage() {
  const tools = [
    {
      name: 'SPF Checker',
      icon: Shield,
      description: 'Validate SPF records',
      component: SPFChecker,
    },
    {
      name: 'DMARC Checker',
      icon: Mail,
      description: 'Check DMARC policy',
      component: DMARCChecker,
    },
    {
      name: 'DNS Lookup',
      icon: Globe,
      description: 'DNS record checker',
      component: DNSChecker,
    },
    {
      name: 'Header Analyzer',
      icon: FileText,
      description: 'Analyze email headers',
      component: HeaderAnalyzer,
    },
    {
      name: 'Phishing Checker',
      icon: AlertTriangle,
      description: 'Detect phishing URLs',
      component: PhishingChecker,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Email Security <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tools</span>
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive suite of tools to validate and secure your email infrastructure
            </p>
          </div>
        </div>

        {/* Tools Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-white p-2 shadow-sm mb-8 overflow-x-auto">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Tab
                    key={tool.name}
                    className={({ selected }) =>
                      cn(
                        'flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                        selected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tool.name}</span>
                  </Tab>
                );
              })}
            </Tab.List>

            <Tab.Panels>
              {tools.map((tool) => {
                const ToolComponent = tool.component;
                return (
                  <Tab.Panel key={tool.name} className="focus:outline-none">
                    <ToolComponent />
                  </Tab.Panel>
                );
              })}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
      <Footer />
    </>
  );
}
