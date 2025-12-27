'use client';

import EmailChecker from '@/components/EmailChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function EmailCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Validator</h1>
            <p className="text-gray-600">
              Validate email addresses with comprehensive checks including syntax validation,
              DNS verification, SMTP check, and disposable email detection. Get instant and accurate results.
            </p>
          </div>
          <EmailChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
