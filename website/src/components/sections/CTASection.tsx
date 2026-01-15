'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Mail, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAppUrl } from '@/lib/config';

export default function CTASection() {
  const tools = [
    {
      icon: Mail,
      title: 'Email Validator',
      description: 'Verify single email addresses instantly',
      link: '/tools/email-checker',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Bulk Checker',
      description: 'Validate hundreds of emails at once',
      link: '/tools/bulk-checker',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      title: 'All Tools',
      description: 'Explore our complete toolset',
      link: '/tools',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of users validating emails with Sugesto. Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href={getAppUrl('/auth/signup')}>
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Quick Links to Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Try Our Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={tool.link}>
                    <Card hover className="h-full group cursor-pointer">
                      <CardContent className="text-center">
                        <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan?{' '}
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
              Contact our sales team
            </Link>
          </p>
          <p className="text-gray-600">
            Or learn more{' '}
            <Link href="/about" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
              about Sugesto
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
