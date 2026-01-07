'use client';

import DNSChecker from '@/components/tools/DNSChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DNSCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">DNS Record Lookup</h1>
            <p className="text-gray-600">
              Perform comprehensive DNS record lookups including A, MX, NS, and TXT records.
              View all DNS information for any domain.
            </p>
          </div>
          <DNSChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
