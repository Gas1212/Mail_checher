'use client';

import TXTChecker from '@/components/tools/TXTChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TXTCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TXT Record Checker</h1>
            <p className="text-gray-600">
              Check all TXT records for a domain and identify SPF, DMARC, DKIM records,
              and domain verification records. Get a comprehensive view of all TXT-based configurations.
            </p>
          </div>
          <TXTChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
