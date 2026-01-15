'use client';

import { Check, X, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getAppUrl } from '@/lib/config';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out our service',
      features: [
        { text: '100 validations/month', included: true },
        { text: 'Syntax validation', included: true },
        { text: 'DNS verification', included: true },
        { text: 'SMTP check', included: false },
        { text: 'Disposable detection', included: true },
        { text: 'Bulk validation', included: false },
        { text: 'Email support', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      ctaLink: getAppUrl('/auth/signup'),
      popular: false,
    },
    {
      name: 'Pro',
      icon: Star,
      price: '$20',
      period: '/month',
      description: 'For professionals and small teams',
      features: [
        { text: '10,000 validations/month', included: true },
        { text: 'Syntax validation', included: true },
        { text: 'DNS verification', included: true },
        { text: 'SMTP check', included: true },
        { text: 'Disposable detection', included: true },
        { text: 'Bulk validation', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: true,
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
                Simple, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Transparent</span> Pricing
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Choose the plan that fits your needs. All plans include our core validation features.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.name} className="relative">
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge variant="success" className="px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card
                      hover
                      className={`h-full ${
                        plan.popular
                          ? 'border-2 border-indigo-600 shadow-xl'
                          : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            plan.popular
                              ? 'bg-indigo-600'
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              plan.popular ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          {plan.popular && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="mb-6">
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <span className="text-gray-600 ml-2">{plan.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-3">
                              {feature.included ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              )}
                              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant={plan.popular ? 'primary' : 'outline'}
                          size="lg"
                          className="w-full"
                          asChild
                        >
                          <Link href={plan.ctaLink}>{plan.cta}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    question: 'Can I change my plan later?',
                    answer: 'Yes, you can upgrade from Free to Pro at any time by contacting our sales team.',
                  },
                  {
                    question: 'What happens if I exceed my monthly limit?',
                    answer: 'If you exceed your monthly validation limit on the Free plan, you can upgrade to Pro for higher limits and additional features.',
                  },
                  {
                    question: 'Do you offer refunds?',
                    answer: 'We offer a 30-day money-back guarantee on Pro plan. If you\'re not satisfied with our service, contact us for a full refund.',
                  },
                  {
                    question: 'Is there a free trial?',
                    answer: 'Yes! The Free plan lets you try our service with 100 validations per month, no credit card required.',
                  },
                  {
                    question: 'How do I subscribe to the Pro plan?',
                    answer: 'Click "Contact Sales" on the Pro plan to send us your requirements. Our team will get back to you within 24 hours to set up your account.',
                  },
                ].map((faq, index) => (
                  <div key={index}>
                    <Card>
                      <CardContent>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
