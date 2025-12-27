'use client';

import DMARCChecker from '@/components/tools/DMARCChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DMARCCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">DMARC Record Checker</h1>
            <p className="text-gray-600">
              Check DMARC (Domain-based Message Authentication, Reporting & Conformance) policies.
              Verify email authentication and reporting configuration for your domain.
            </p>
          </div>
          <DMARCChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
