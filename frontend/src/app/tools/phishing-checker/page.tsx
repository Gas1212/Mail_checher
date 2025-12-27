'use client';

import PhishingChecker from '@/components/tools/PhishingChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PhishingCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Phishing Link Checker</h1>
            <p className="text-gray-600">
              Analyze URLs for potential phishing attempts and security threats.
              Get a risk score and detailed analysis of suspicious link indicators.
            </p>
          </div>
          <PhishingChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
