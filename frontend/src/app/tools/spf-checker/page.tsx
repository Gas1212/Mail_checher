'use client';

import SPFChecker from '@/components/tools/SPFChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SPFCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SPF Record Checker</h1>
            <p className="text-gray-600">
              Validate Sender Policy Framework (SPF) records for email authentication.
              Check if a domain has proper SPF configuration to prevent email spoofing.
            </p>
          </div>
          <SPFChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
