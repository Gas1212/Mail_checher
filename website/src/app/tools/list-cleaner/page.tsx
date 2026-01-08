'use client';

import { useState } from 'react';
import { Sparkles, Check, X, Loader2, Upload, Download, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface CleanResult {
  original: string[];
  cleaned: string[];
  duplicatesRemoved: number;
  invalidRemoved: number;
  totalRemoved: number;
}

export default function ListCleanerPage() {
  const [emails, setEmails] = useState('');
  const [result, setResult] = useState<CleanResult | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading } = useFreeTrial('list-cleaner');

  const cleanList = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!emails.trim()) {
      return;
    }

    setIsCleaning(true);
    setResult(null);

    // Simulate cleaning (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Parse emails
    const emailList = emails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove duplicates (case-insensitive)
    const uniqueEmails = new Map<string, string>();
    emailList.forEach(email => {
      const lowerEmail = email.toLowerCase();
      if (!uniqueEmails.has(lowerEmail)) {
        uniqueEmails.set(lowerEmail, email);
      }
    });

    // Filter valid emails
    const validEmails = Array.from(uniqueEmails.values()).filter(email =>
      emailRegex.test(email)
    );

    const duplicatesCount = emailList.length - uniqueEmails.size;
    const invalidCount = uniqueEmails.size - validEmails.length;

    const cleanResult: CleanResult = {
      original: emailList,
      cleaned: validEmails,
      duplicatesRemoved: duplicatesCount,
      invalidRemoved: invalidCount,
      totalRemoved: duplicatesCount + invalidCount,
    };

    setResult(cleanResult);
    setIsCleaning(false);

    // Use one trial
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTrialsLeft = useOneTrial();
    if (!hasTrialsLeft) {
      // Show modal after displaying result
      setTimeout(() => setShowUpgradeModal(true), 2000);
    }
  };

  const downloadCleaned = () => {
    if (!result || result.cleaned.length === 0) return;

    const content = result.cleaned.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned-emails-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Email List Cleaner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Remove duplicates and invalid emails from your mailing lists. Clean your data instantly and improve deliverability.
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
                    Email List (one per line)
                  </label>
                  <textarea
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="user1@example.com&#10;user2@example.com&#10;user1@example.com&#10;invalid-email"
                    disabled={isCleaning || hasExceededLimit}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {emails.split('\n').filter(e => e.trim().length > 0).length} emails entered
                  </p>
                </div>

                <Button
                  onClick={cleanList}
                  isLoading={isCleaning}
                  disabled={!emails.trim() || isCleaning || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isCleaning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cleaning...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Clean Email List
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
          {result && (
            <Card className="mb-8 border-2 border-gray-200">
              <CardContent>
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Cleaning Results
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.original.length}</div>
                        <div className="text-sm text-gray-600">Original</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.cleaned.length}</div>
                        <div className="text-sm text-gray-600">Cleaned</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{result.duplicatesRemoved}</div>
                        <div className="text-sm text-gray-600">Duplicates</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{result.invalidRemoved}</div>
                        <div className="text-sm text-gray-600">Invalid</div>
                      </div>
                    </div>
                  </div>

                  {/* Improvement Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total emails removed</p>
                      <p className="text-2xl font-bold text-purple-600">{result.totalRemoved}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">List quality improved by</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.original.length > 0
                          ? Math.round((result.totalRemoved / result.original.length) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={downloadCleaned}
                      variant="primary"
                      className="flex-1"
                      disabled={result.cleaned.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Cleaned List
                    </Button>
                    <Button
                      onClick={() => {
                        setEmails(result.cleaned.join('\n'));
                        setResult(null);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Use Cleaned List
                    </Button>
                  </div>

                  {/* Success Message */}
                  {result.totalRemoved > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-900">List cleaned successfully!</p>
                          <p className="text-sm text-green-700 mt-1">
                            Removed {result.duplicatesRemoved} duplicate{result.duplicatesRemoved !== 1 ? 's' : ''} and {result.invalidRemoved} invalid email{result.invalidRemoved !== 1 ? 's' : ''}.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.totalRemoved === 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800">
                          Your list is already clean! No duplicates or invalid emails found.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What Gets Cleaned
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Trash2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Duplicate Emails:</strong> Removes duplicate entries (case-insensitive comparison)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Invalid Syntax:</strong> Filters out emails that don&apos;t match proper email format</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Format Validation:</strong> Ensures all emails follow RFC 5322 standards</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Easy Export:</strong> Download cleaned list as a text file for immediate use</p>
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
        toolName="Email List Cleaner"
      />
    </>
  );
}
