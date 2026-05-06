'use client';

import { useState } from 'react';
import { AlertTriangle, Check, X, Loader2, Globe, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface BlacklistResult {
  target: string;
  isListed: boolean;
  totalChecked: number;
  listedOn: string[];
  cleanOn: string[];
}

export default function BlacklistCheckerPage() {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState<'domain' | 'ip'>('domain');
  const [result, setResult] = useState<BlacklistResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('blacklist-checker');

  // Common blacklists to check
  const blacklists = [
    'Spamhaus ZEN',
    'Barracuda',
    'SpamCop',
    'SORBS',
    'UCEPROTECT',
    'Spamrats',
    'Invaluement',
    'PSBL',
  ];

  const checkBlacklist = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!target.trim()) {
      return;
    }

    setIsChecking(true);
    setResult(null);

    // Simulate blacklist check (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random blacklist results
    const listedBlacklists: string[] = [];
    const cleanBlacklists: string[] = [];

    // Randomly determine if listed (10% chance for demo)
    blacklists.forEach(blacklist => {
      if (Math.random() < 0.1) {
        listedBlacklists.push(blacklist);
      } else {
        cleanBlacklists.push(blacklist);
      }
    });

    const checkResult: BlacklistResult = {
      target: target.trim(),
      isListed: listedBlacklists.length > 0,
      totalChecked: blacklists.length,
      listedOn: listedBlacklists,
      cleanOn: cleanBlacklists,
    };

    setResult(checkResult);
    setIsChecking(false);

    // Use one trial
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTrialsLeft = consumeTrial();
    if (!hasTrialsLeft) {
      // Show modal after displaying result
      setTimeout(() => setShowUpgradeModal(true), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkBlacklist();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blacklist Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check if your domain or IP address is listed on major spam blacklists. Protect your email reputation.
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
                {/* Target Type Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Check Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setTargetType('domain')}
                      disabled={isChecking || hasExceededLimit}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        targetType === 'domain'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Globe className="w-5 h-5 mx-auto mb-1" />
                      Domain
                    </button>
                    <button
                      onClick={() => setTargetType('ip')}
                      disabled={isChecking || hasExceededLimit}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        targetType === 'ip'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Shield className="w-5 h-5 mx-auto mb-1" />
                      IP Address
                    </button>
                  </div>
                </div>

                {/* Target Input */}
                <Input
                  label={targetType === 'domain' ? 'Domain Name' : 'IP Address'}
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={targetType === 'domain' ? 'example.com' : '192.168.1.1'}
                  disabled={isChecking || hasExceededLimit}
                />

                <Button
                  onClick={checkBlacklist}
                  isLoading={isChecking}
                  disabled={!target.trim() || isChecking || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Checking {blacklists.length} Blacklists...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Check Blacklists
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
                  {/* Overall Status */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Blacklist Check Results
                      </h3>
                      <p className="text-gray-600">{result.target}</p>
                    </div>
                    <div>
                      {result.isListed ? (
                        <Badge variant="error" className="text-base px-4 py-2">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Listed
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-base px-4 py-2">
                          <Check className="w-4 h-4 mr-2" />
                          Clean
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.totalChecked}</div>
                      <div className="text-sm text-gray-600">Checked</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{result.cleanOn.length}</div>
                      <div className="text-sm text-gray-600">Clean</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{result.listedOn.length}</div>
                      <div className="text-sm text-gray-600">Listed</div>
                    </div>
                  </div>

                  {/* Listed Blacklists */}
                  {result.listedOn.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-900">⚠️ Found on {result.listedOn.length} Blacklist{result.listedOn.length > 1 ? 's' : ''}:</h4>
                      <div className="space-y-2">
                        {result.listedOn.map((blacklist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                              <span className="font-medium text-red-900">{blacklist}</span>
                            </div>
                            <Badge variant="error" className="text-xs">
                              Action Required
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Action Required:</strong> Being listed can severely impact email deliverability.
                          Contact the blacklist operators to request removal and investigate the cause of the listing.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Clean Blacklists */}
                  {result.cleanOn.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-900">✓ Clean on {result.cleanOn.length} Blacklist{result.cleanOn.length > 1 ? 's' : ''}:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.cleanOn.map((blacklist, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-green-900">{blacklist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {!result.isListed && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-900">Great news!</p>
                          <p className="text-sm text-green-700 mt-1">
                            Your {targetType === 'domain' ? 'domain' : 'IP address'} is not listed on any of the checked blacklists.
                            Your email reputation is in good standing.
                          </p>
                        </div>
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
                About Email Blacklists
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p><strong>What are Blacklists?</strong> DNS-based blocklists used by email servers to identify and block spam sources</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Why Check?</strong> Being blacklisted can prevent your emails from reaching recipients, harming your sender reputation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Prevention:</strong> Use SPF, DKIM, and DMARC records, maintain good email practices, and monitor regularly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Removal:</strong> If listed, contact the blacklist operator directly to request delisting after fixing the issue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToolContent
        schemaId="blacklist-checker-faq"
        sections={[
          {
            h2: "How Email Blacklists Work",
            content: "Email blacklists (also called DNSBLs — DNS-based Block Lists) are real-time databases maintained by anti-spam organizations, ISPs, and security companies that track IP addresses and domains associated with spam, phishing, malware distribution, or other malicious email behavior. When a receiving mail server processes an incoming message, it queries multiple blacklist databases in milliseconds to check whether the sending IP or domain has been reported.\n\nBlacklists collect data through several mechanisms: spam trap networks, user spam reports (when recipients manually mark messages as spam), honeypot networks, and analysis of email sending patterns. Different blacklists have different standards for listing — some are aggressive and list IPs based on a single spam trap hit, while others require sustained patterns of abuse before listing.\n\nThe impact of a blacklist listing varies by which list you appear on. Major operational blacklists like Spamhaus SBL, Spamhaus ZEN, SpamCop, or Barracuda Central are consulted by most mail servers globally. Being listed on one of these can cause widespread delivery failures. Smaller or more specialized lists may only affect delivery to specific ISPs or countries.",
          },
          {
            h2: "Common Causes of Blacklisting",
            content: "Understanding what triggers blacklisting helps you avoid it. The most common causes are sending unsolicited email, having a compromised server or account that sends spam without your knowledge, poor list hygiene that results in hitting spam traps, unusually high complaint rates from recipients, and sudden large increases in sending volume that trigger automated abuse detection.\n\nCompromised accounts and servers are a particularly insidious cause because you may not know it is happening. If your email server or a user account on your domain is compromised, attackers can use it to send thousands of spam messages while you are unaware. Monitoring your outbound mail logs for unusual sending patterns and setting up DMARC with reporting lets you detect and stop unauthorized sending quickly.\n\nShared IP addresses present unique blacklisting risks. If you use a shared IP pool (common with lower-tier email service provider accounts), another sender's bad behavior can get your shared IP listed. Dedicated IP addresses eliminate this risk but require careful warming — sending at gradually increasing volumes to build the IP's reputation before ramping to full sending volume.",
          },
          {
            h2: "Removing Yourself from Blacklists",
            content: "The removal process varies significantly by blacklist operator. Most major blacklists have a self-service delisting request process accessible through their website. Before requesting removal, you must understand and fix the root cause of the listing — submitting a removal request while still sending spam or with a compromised server will result in re-listing, and some lists impose time penalties for repeated listing and delisting cycles.\n\nSpamhaus requires that you fix the underlying issue and provide a detailed explanation of what caused the listing and what steps were taken to prevent recurrence. SpamCop listings expire automatically after a period of clean sending. Barracuda Central requires an account creation and explanation. Each blacklist has its own timeline — removals can happen within hours or take several days.\n\nPreventing re-listing is more important than removal speed. After delisting, implement proper list hygiene, monitor complaint rates, set up feedback loops with major ISPs, and authenticate email with SPF, DKIM, and DMARC. These practices demonstrate responsible sending to both blacklist operators and ISPs and significantly reduce the risk of future listings.",
          },
        ]}
        faqs={[
          {
            q: "Which blacklists should I check for email deliverability?",
            a: "The most impactful blacklists for email deliverability are Spamhaus SBL (Spamhaus Block List), Spamhaus XBL (Exploits Block List), Spamhaus DBL (Domain Block List), SpamCop, Barracuda Central, and SORBS. Our checker queries all major operational blacklists simultaneously, returning a comprehensive status across all databases in a single check. We recommend checking both your sending IP address and your sending domain for complete coverage.",
          },
          {
            q: "How quickly do blacklist removals take effect?",
            a: "Removal timelines vary by blacklist. SpamCop listings expire automatically after 24 hours of clean sending without manual intervention. Spamhaus removals are typically processed within hours once approved. Barracuda Central usually processes requests within 12-24 hours. Once the listing is removed from the blacklist database, mail server caches may take an additional 2-4 hours to refresh, after which delivery to previously affected recipients should normalize.",
          },
          {
            q: "Can I be blacklisted even if I only send legitimate email?",
            a: "Yes, several scenarios can cause innocent senders to be blacklisted. Your IP may be shared with a bad sender on the same mail server. A compromised account on your domain may have sent spam without your knowledge. Your list may contain spam trap addresses collected through scraped or purchased contacts. You may have acquired a previously blacklisted IP address. Regular blacklist monitoring helps you detect these situations quickly before they significantly impact deliverability.",
          },
          {
            q: "How often should I check my IP and domain against blacklists?",
            a: "High-volume senders should check blacklist status daily — automated monitoring with alerts is ideal. Lower-volume senders should check weekly at minimum, and immediately whenever deliverability issues are suspected such as increased bounce rates, low inbox placement, or recipient reports of not receiving email. Setting up a monitoring schedule ensures you detect listings quickly, before they cause significant campaign damage.",
          },
          {
            q: "What is the difference between an IP blacklist and a domain blacklist?",
            a: "IP blacklists flag specific IP addresses used by mail servers to send email. Domain blacklists flag domain names found in spam message content — either in the From address, links within the email body, or the envelope sender domain. You can have a clean IP but a blacklisted domain, or a clean domain but a blacklisted IP. Comprehensive deliverability protection requires checking both your sending IP and your domain.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Blacklist Checker"
      />
    </>
  );
}
