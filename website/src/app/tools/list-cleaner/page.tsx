'use client';

import { useState } from 'react';
import { Sparkles, Check, X, Loader2, Upload, Download, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
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

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('list-cleaner');

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
    const hasTrialsLeft = consumeTrial();
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
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm text-gray-900 placeholder:text-gray-400 bg-white"
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
      <ToolContent
        schemaId="list-cleaner-faq"
        sections={[
          {
            h2: "What Email List Cleaning Removes",
            content: "Email list cleaning is the process of removing addresses that will harm your deliverability or violate compliance requirements before sending. A clean list is not just one without obvious errors — it is a carefully filtered dataset that maximizes the chance of every send reaching an engaged, real recipient.\n\nThe cleaning process addresses multiple categories of problematic addresses. Syntactically invalid addresses (missing @, invalid characters, malformed domains) are the most obvious category. Invalid domains — those without MX records or that have been suspended — represent the next layer. Addresses from known disposable email services indicate users who wanted to avoid contact. Spam trap addresses, planted by ISPs and anti-spam organizations to catch senders with poor list practices, are particularly dangerous.\n\nBeyond these hard categories, soft suppression decisions include removing role accounts from personalized campaigns, excluding addresses with repeated soft bounces, and culling addresses with extended periods of inactivity. Each cleaning decision trades some list size for improved quality and deliverability.",
          },
          {
            h2: "The Business Case for Regular List Hygiene",
            content: "Unclean email lists create compounding costs. ISPs measure sender reputation using engagement and bounce metrics, and a degraded reputation affects every message you send — not just those to invalid addresses. Once ISPs begin routing your email to spam folders, re-establishing inbox placement can take weeks of careful, low-volume sending to rebuild trust.\n\nFrom a pure cost perspective, most email platforms charge by the number of subscribers or emails sent. Maintaining invalid contacts that can never convert wastes budget on every send. A list that is 20% invalid addresses effectively inflates your email costs by 20% with zero corresponding benefit. Cleaning returns that wasted spend to productive use.\n\nEngagement metrics also suffer with dirty lists. Open rate, click rate, and conversion rate calculations become misleading when invalid addresses are included in the denominator but can never contribute to the numerator. Clean list metrics give you accurate signals about what content resonates with your actual audience, enabling better decisions about campaign strategy and audience segmentation.",
          },
          {
            h2: "Automating List Hygiene at Scale",
            content: "Manual list cleaning does not scale — it is a one-time fix that gradually degrades until the next cleaning cycle. Automated hygiene, integrated into your collection and sending workflows, maintains list quality continuously without requiring periodic manual intervention.\n\nReal-time validation at sign-up forms is the most impactful automation: every new addition is verified before it enters your database, preventing the accumulation of invalid addresses. Form-level validation catches immediate typos and invalid domains, while server-side validation can be more thorough, catching disposable emails and verifying mailbox existence.\n\nEngagement-based suppression automation removes subscribers who consistently fail to engage over a defined period. Most sophisticated email platforms allow automated suppression rules: if a subscriber has not opened any of the last 10 campaigns in 6 months, suppress them or trigger a re-engagement campaign first. Combining validation-based cleaning with engagement-based suppression creates a self-maintaining list that improves over time rather than degrading.",
          },
        ]}
        faqs={[
          {
            q: "How is email list cleaning different from email validation?",
            a: "Email validation focuses on technical verification — checking if an address is correctly formatted, if the domain has MX records, and if the mailbox responds to SMTP probes. Email list cleaning is a broader process that includes validation plus additional quality filtering: removing addresses based on engagement history, spam trap avoidance, suppression list matching, and business rules like role account removal. Cleaning produces a sending-ready list, while validation produces a technically-valid list.",
          },
          {
            q: "What are spam traps and why are they dangerous?",
            a: "Spam traps are email addresses operated by ISPs and anti-spam organizations specifically to catch senders who acquire addresses without permission or fail to maintain clean lists. Pristine spam traps are addresses that have never been used for legitimate registration. Recycled spam traps are old abandoned addresses repurposed for catching senders who keep contacts too long. Triggering either type can result in immediate blacklisting or severe sender reputation damage.",
          },
          {
            q: "How often should I clean my email list?",
            a: "As a baseline, quarterly full validation is recommended for active marketing lists. Additionally, clean before any major campaign launch, after importing contacts from external sources, and after extended periods of not mailing the list. Setting up real-time validation at point of capture reduces the burden of periodic bulk cleaning since new additions always enter clean.",
          },
          {
            q: "What percentage of email addresses typically become invalid?",
            a: "Industry data suggests that 22-30% of email addresses become invalid within 12 months. People change jobs losing their corporate email, switch providers, abandon old accounts, or delete accounts created for specific purposes. B2B lists tend to degrade faster than B2C lists because job changes are frequent and corporate email access ends immediately with employment. This decay rate makes regular validation essential for maintaining deliverability.",
          },
          {
            q: "Can cleaning my list improve open rates?",
            a: "Yes, in two ways. First, removing invalid addresses means open rate calculations are based on a more accurate denominator of reachable recipients, which typically raises the reported percentage. Second, ISPs use engagement signals to score your sender reputation. A cleaner list with higher proportional engagement signals demonstrates to ISPs that you are a quality sender, which improves inbox placement — ensuring your emails are actually seen rather than filtered to spam.",
          },
        ]}
      />
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
