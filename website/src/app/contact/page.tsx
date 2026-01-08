'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Sugesto team. We are here to help with your email validation and SEO tool needs. Contact us for support, questions, or feedback.',
  keywords: ['contact', 'support', 'customer service', 'email support', 'get in touch', 'help'],
  openGraph: {
    title: 'Contact Us - Sugesto',
    description: 'Get in touch with the Sugesto team. We are here to help with your email validation and SEO tool needs.',
    url: 'https://sugesto.xyz/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Sugesto',
    description: 'Get in touch with the Sugesto team.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/contact',
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@emailchecker.com',
      link: 'mailto:support@emailchecker.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'San Francisco, CA 94102',
      link: '#',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Get in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card hover>
                        <CardContent>
                          <a
                            href={info.link}
                            className="flex items-start space-x-4 group"
                          >
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                              <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {info.title}
                              </h3>
                              <p className="text-gray-600">{info.value}</p>
                            </div>
                          </a>
                        </CardContent>
                      </Card>
                  );
                })}
              </div>

              {/* Contact Form */}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardContent>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Send us a Message
                    </h2>

                    {submitted && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-green-800 font-medium">
                          Message sent successfully! We&apos;ll get back to you soon.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>

                      <Input
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Tell us more about your inquiry..."
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        isLoading={isSubmitting}
                        className="w-full md:w-auto"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
