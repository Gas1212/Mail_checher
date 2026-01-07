'use client';

import HeaderAnalyzer from '@/components/tools/HeaderAnalyzer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HeaderAnalyzerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Header Analyzer</h1>
            <p className="text-gray-600">
              Analyze email headers for security threats and authentication results.
              Check SPF, DKIM, DMARC status and detect potential email spoofing.
            </p>
          </div>
          <HeaderAnalyzer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
