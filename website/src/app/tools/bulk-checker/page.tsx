'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Upload, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UpgradeModal from '@/components/ui/UpgradeModal';

export default function BulkCheckerPage() {
  const [emails, setEmails] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const validateEmails = async () => {
    // Bulk validation requires authentication
    // Show upgrade modal to encourage sign up
    setShowUpgradeModal(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bulk Email Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Validate multiple email addresses at once. Create a free account to get started with 100 free validations per month.
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses (one per line)
                  </label>
                  <textarea
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="example1@domain.com&#10;example2@domain.com&#10;example3@domain.com"
                    rows={10}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {emails.split('\n').filter(e => e.trim().length > 0).length} emails entered
                  </p>
                </div>

                <Button
                  onClick={validateEmails}
                  disabled={!emails.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Validate Emails
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Bulk validation requires a free account
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Upload className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Upload or Paste:</strong> Enter email addresses one per line or paste from Excel/CSV</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Instant Validation:</strong> Each email is checked for syntax, domain, MX records, and disposable detection</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Export Results:</strong> Download results as CSV for easy integration with your tools</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Account Required:</strong> Bulk validation requires a free account. Sign up to get 100 free validations per month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Bulk Email Checker"
      />
    </>
  );
}
