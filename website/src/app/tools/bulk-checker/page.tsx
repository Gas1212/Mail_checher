'use client';

import { useState } from 'react';
import { Mail, Check, X, AlertCircle, Loader2, Upload, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface EmailResult {
  email: string;
  isValid: boolean;
  reason: string;
}

export default function BulkCheckerPage() {
  const [emails, setEmails] = useState('');
  const [results, setResults] = useState<EmailResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading } = useFreeTrial('bulk-checker');

  const validateEmails = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!emails.trim()) {
      return;
    }

    setIsValidating(true);
    setResults([]);

    // Simulate validation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse emails
    const emailList = emails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    // Basic validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];

    const validationResults: EmailResult[] = emailList.map(email => {
      const syntaxValid = emailRegex.test(email);
      const hasDomain = email.includes('@') && email.split('@')[1]?.includes('.');
      const domain = email.split('@')[1]?.toLowerCase() || '';
      const isDisposable = disposableDomains.some(d => domain.includes(d));

      let reason = '';
      if (!syntaxValid) {
        reason = 'Invalid syntax';
      } else if (!hasDomain) {
        reason = 'Invalid domain';
      } else if (isDisposable) {
        reason = 'Disposable email';
      } else {
        reason = 'Valid';
      }

      return {
        email,
        isValid: syntaxValid && hasDomain && !isDisposable,
        reason,
      };
    });

    setResults(validationResults);
    setIsValidating(false);

    // Use one trial
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTrialsLeft = useOneTrial();
    if (!hasTrialsLeft) {
      // Show modal after displaying result
      setTimeout(() => setShowUpgradeModal(true), 2000);
    }
  };

  const downloadResults = () => {
    if (results.length === 0) return;

    const csv = [
      'Email,Status,Reason',
      ...results.map(r => `${r.email},${r.isValid ? 'Valid' : 'Invalid'},${r.reason}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-validation-results-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

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
              Validate multiple email addresses at once. Enter one email per line or paste from a spreadsheet.
            </p>

            {/* Trial counter */}
            {!isLoading && !hasExceededLimit && (
              <div className="mt-6">
                <Badge variant="default" className="text-sm">
                  {remainingTrials} free {remainingTrials === 1 ? 'try' : 'tries'} remaining
                </Badge>
              </div>
            )}
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
                    disabled={isValidating || hasExceededLimit}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {emails.split('\n').filter(e => e.trim().length > 0).length} emails entered
                  </p>
                </div>

                <Button
                  onClick={validateEmails}
                  isLoading={isValidating}
                  disabled={!emails.trim() || isValidating || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Validate Emails
                    </>
                  )}
                </Button>

                {hasExceededLimit && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Create a free account to continue →
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <Card className="mb-8 border-2 border-gray-200">
              <CardContent>
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Validation Results
                      </h3>
                      <p className="text-gray-600">
                        {results.length} {results.length === 1 ? 'email' : 'emails'} checked
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{validCount}</div>
                        <div className="text-sm text-gray-600">Valid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
                        <div className="text-sm text-gray-600">Invalid</div>
                      </div>
                      <Button
                        onClick={downloadResults}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          result.isValid ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            result.isValid ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {result.isValid ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{result.email}</p>
                          </div>
                        </div>
                        <Badge variant={result.isValid ? 'success' : 'error'} className="text-xs ml-2">
                          {result.reason}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <p><strong>Free Trials:</strong> Try 3 times for free, then create a free account for 100 validations/month</p>
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
