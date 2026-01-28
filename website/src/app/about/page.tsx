import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Mail, Users, Zap, ArrowRight, Puzzle, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sugesto, our mission to provide reliable email validation and SEO tools for businesses and developers worldwide. Built with modern technology for accuracy and performance.',
  keywords: ['about sugesto', 'email validation company', 'email verification service', 'our mission', 'email tools'],
  openGraph: {
    title: 'About Sugesto - Email Validation & SEO Tools',
    description: 'Learn about Sugesto, our mission to provide reliable email validation and SEO tools for businesses and developers worldwide.',
    url: 'https://sugesto.xyz/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sugesto',
    description: 'Our mission to provide reliable email validation and SEO tools.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/about',
  },
};

export default function AboutPage() {
  const stats = [
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '<100ms', label: 'Response Time' },
    { value: '1M+', label: 'Emails Validated' },
    { value: '24/7', label: 'Availability' },
  ];

  const values = [
    {
      icon: Check,
      title: 'Accuracy First',
      description: 'We prioritize precision in every validation check to ensure reliable results.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant results with our optimized validation infrastructure.',
    },
    {
      icon: Mail,
      title: 'Comprehensive',
      description: 'Four-layer validation covering syntax, DNS, SMTP, and disposable checks.',
    },
    {
      icon: Users,
      title: 'Developer Friendly',
      description: 'Simple API integration with detailed documentation and support.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sugesto</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                We provide the most accurate and comprehensive email validation service
                to help businesses maintain clean email lists and improve deliverability.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to provide developers and businesses with the most reliable
                email validation tools. We believe in data quality, accuracy, and simplicity.
                Every email validation should be fast, accurate, and effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title}>
                    <Card hover>
                      <CardContent>
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {value.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Built with Modern Technology
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Sugesto is built on a modern tech stack designed for performance,
                reliability, and scalability. We use Django REST Framework for our backend,
                Next.js for the frontend, and MongoDB for data storage, ensuring fast
                response times and high availability.
              </p>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Real-time email validation with SMTP testing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive DNS and MX record verification</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Advanced disposable email detection</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">RESTful API with detailed responses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Try Our Tools?
              </h2>
              <p className="text-xl text-gray-600">
                Experience the power of accurate email validation and SEO tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Link href="/tools/email-checker">
                <Card hover className="h-full group cursor-pointer">
                  <CardContent className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Email Validator
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Verify single emails instantly
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tools/chrome-extensions">
                <Card hover className="h-full group cursor-pointer">
                  <CardContent className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Puzzle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Extensions Analyzer
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Check Chrome extension security
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/tools">
                <Card hover className="h-full group cursor-pointer">
                  <CardContent className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      All Tools
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Explore our complete toolset
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/pricing">
                  View Pricing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
