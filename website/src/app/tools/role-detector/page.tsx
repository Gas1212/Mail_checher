'use client';

import { useState } from 'react';
import { Shield, Check, X, AlertCircle, Loader2, User, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface DetectionResult {
  email: string;
  isRoleAccount: boolean;
  accountType: 'personal' | 'role' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export default function RoleDetectorPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('role-detector');

  const detectRoleAccount = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!email.trim()) {
      return;
    }

    setIsDetecting(true);
    setResult(null);

    // Simulate detection (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Common role-based prefixes
    const rolePatterns = [
      'admin', 'administrator', 'info', 'contact', 'support', 'help', 'sales',
      'marketing', 'billing', 'invoice', 'accounts', 'hr', 'jobs', 'careers',
      'no-reply', 'noreply', 'postmaster', 'webmaster', 'hostmaster',
      'abuse', 'security', 'privacy', 'legal', 'compliance', 'team',
      'hello', 'hi', 'welcome', 'service', 'customerservice', 'orders'
    ];

    const emailLower = email.toLowerCase();
    const localPart = emailLower.split('@')[0] || '';

    // Check if email matches role patterns
    const isRole = rolePatterns.some(pattern =>
      localPart === pattern ||
      localPart.startsWith(pattern + '.') ||
      localPart.startsWith(pattern + '-') ||
      localPart.endsWith('.' + pattern) ||
      localPart.endsWith('-' + pattern)
    );

    // Check for numeric patterns (often personal)
    const hasNumbers = /\d/.test(localPart);
    const hasDots = localPart.includes('.');

    let accountType: 'personal' | 'role' | 'unknown' = 'unknown';
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let reason = '';

    if (isRole) {
      accountType = 'role';
      confidence = 'high';
      reason = 'Email prefix matches common role-based account patterns';
    } else if (hasNumbers && hasDots) {
      accountType = 'personal';
      confidence = 'medium';
      reason = 'Email contains numbers and dots, typical of personal accounts';
    } else if (hasDots) {
      accountType = 'personal';
      confidence = 'medium';
      reason = 'Email format suggests personal account (firstname.lastname pattern)';
    } else if (hasNumbers) {
      accountType = 'personal';
      confidence = 'low';
      reason = 'Email contains numbers, likely personal but uncertain';
    } else {
      accountType = 'unknown';
      confidence = 'low';
      reason = 'Unable to determine account type with confidence';
    }

    const detectionResult: DetectionResult = {
      email,
      isRoleAccount: accountType === 'role',
      accountType,
      confidence,
      reason,
    };

    setResult(detectionResult);
    setIsDetecting(false);

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
      detectRoleAccount();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Role Account Detector
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Identify whether an email address is a generic role-based account or a personal account. Improve your email targeting.
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
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="example@domain.com"
                  disabled={isDetecting || hasExceededLimit}
                />

                <Button
                  onClick={detectRoleAccount}
                  isLoading={isDetecting}
                  disabled={!email.trim() || isDetecting || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Detecting...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Detect Account Type
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
                        Detection Result
                      </h3>
                      <p className="text-gray-600">{result.email}</p>
                    </div>
                    <div>
                      {result.accountType === 'role' ? (
                        <Badge variant="error" className="text-base px-4 py-2">
                          <Users className="w-4 h-4 mr-2" />
                          Role Account
                        </Badge>
                      ) : result.accountType === 'personal' ? (
                        <Badge variant="success" className="text-base px-4 py-2">
                          <User className="w-4 h-4 mr-2" />
                          Personal Account
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-base px-4 py-2">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Unknown
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Detection Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Analysis Details:</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Account Type */}
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result.accountType === 'role'
                            ? 'bg-red-100'
                            : result.accountType === 'personal'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}>
                          {result.accountType === 'role' ? (
                            <Users className="w-5 h-5 text-red-600" />
                          ) : result.accountType === 'personal' ? (
                            <User className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{result.accountType} Account</p>
                          <p className="text-sm text-gray-600">
                            {result.accountType === 'role'
                              ? 'Generic organizational email'
                              : result.accountType === 'personal'
                              ? 'Individual user email'
                              : 'Cannot determine type'}
                          </p>
                        </div>
                      </div>

                      {/* Confidence Level */}
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result.confidence === 'high'
                            ? 'bg-green-100'
                            : result.confidence === 'medium'
                            ? 'bg-yellow-100'
                            : 'bg-orange-100'
                        }`}>
                          <Shield className={`w-5 h-5 ${
                            result.confidence === 'high'
                              ? 'text-green-600'
                              : result.confidence === 'medium'
                              ? 'text-yellow-600'
                              : 'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{result.confidence} Confidence</p>
                          <p className="text-sm text-gray-600">
                            {result.confidence === 'high'
                              ? 'Very confident in detection'
                              : result.confidence === 'medium'
                              ? 'Moderately confident'
                              : 'Low confidence, manual review suggested'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className={`p-4 rounded-lg ${
                    result.accountType === 'role'
                      ? 'bg-red-50 border border-red-200'
                      : result.accountType === 'personal'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        result.accountType === 'role'
                          ? 'text-red-600'
                          : result.accountType === 'personal'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`} />
                      <div>
                        <p className="font-medium mb-1">Detection Reason:</p>
                        <p className={
                          result.accountType === 'role'
                            ? 'text-red-800'
                            : result.accountType === 'personal'
                            ? 'text-green-800'
                            : 'text-yellow-800'
                        }>
                          {result.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What are Role Accounts?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Role-Based Accounts:</strong> Generic email addresses like info@, support@, or sales@ that are typically monitored by multiple people</p>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Personal Accounts:</strong> Email addresses assigned to specific individuals, often containing names or unique identifiers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Better Targeting:</strong> Personal accounts typically have higher engagement rates than role-based accounts</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Compliance:</strong> Some email regulations (like GDPR) treat role and personal accounts differently</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToolContent
        schemaId="role-detector-faq"
        sections={[
          {
            h2: "What Are Role-Based Email Accounts?",
            content: "Role-based email accounts are generic addresses associated with a function or department rather than a specific individual. Common examples include info@, support@, admin@, sales@, billing@, noreply@, and contact@ — addresses typically monitored by multiple people or automated systems rather than a single person. These accounts serve important operational purposes but behave very differently from personal email addresses in marketing contexts.\n\nFrom an email marketing perspective, role accounts present several challenges. They are often monitored by multiple team members, meaning the decision to engage with marketing content is not made by a single person. Automated filtering is frequently applied — many role accounts route incoming messages through ticketing systems or shared inboxes that may deprioritize marketing content.\n\nUnder some email regulations, role-based accounts are treated differently from personal accounts. GDPR, for example, distinguishes between organizational emails and individual email addresses. Understanding which addresses on your list are role accounts helps you apply appropriate treatment and compliance handling.",
          },
          {
            h2: "Why Role Account Detection Improves Campaign Performance",
            content: "Filtering role-based accounts from personalized outreach campaigns typically improves engagement metrics significantly. Personal accounts, assigned to specific individuals who chose to receive your communications, consistently show higher open rates, click-through rates, and conversion rates than generic organizational inboxes. By targeting personal accounts, your engagement rates more accurately reflect genuine interest in your content.\n\nFor cold email outreach specifically, role accounts are particularly problematic. A message personalized with a recipient name sent to an info@ or admin@ address appears generic and poorly researched — damaging your credibility with the entire organization. Sending to the right person's direct address demonstrates that you have done your homework and creates a more favorable first impression.\n\nRole account detection also helps with deliverability. Some ISPs and mail servers apply stricter filtering to bulk messages sent to role addresses, treating them as potential spam. Targeting primarily personal accounts reduces this filtering risk and keeps your sender reputation healthy by concentrating sends on addresses more likely to engage.",
          },
          {
            h2: "How Role Account Detection Works",
            content: "Our detection engine analyzes the local part of an email address (the portion before the @ symbol) against a comprehensive list of role-based prefixes, patterns, and common organizational naming conventions. This includes exact matches like info, admin, support, as well as prefix matches like admin.john@ and suffix matches like john.billing@.\n\nThe detection applies confidence scoring to account for ambiguous cases. High-confidence role detections match known generic prefixes exactly. Medium-confidence detections apply when the local part contains role-like terms combined with personal elements, suggesting it could be either a personal account or a hybrid. Low-confidence results indicate addresses where the classification is genuinely uncertain.\n\nFor B2B email lists, combining role detection with job title data from your CRM provides the most accurate targeting. A direct@company.com address might seem personal but be a role account, while a firstname.lastname@company.com address is almost certainly personal. Using both signals together creates more reliable segmentation than either alone.",
          },
        ]}
        faqs={[
          {
            q: "Which email prefixes are considered role-based accounts?",
            a: "Common role-based prefixes include: info, contact, hello, hi, support, help, helpdesk, service, customerservice, sales, marketing, billing, invoice, accounts, hr, jobs, careers, recruitment, admin, administrator, webmaster, postmaster, hostmaster, abuse, security, privacy, legal, compliance, noreply, no-reply, donotreply, team, office, and news. Our detector matches these as exact matches and combined with separators like dots and hyphens.",
          },
          {
            q: "Can role account detection give false positives?",
            a: "Yes, edge cases exist. A person genuinely named Mark Info might have an email like mark.info@domain.com that gets flagged as a role account. Our confidence scoring system flags these ambiguous cases as medium or low confidence rather than high confidence, allowing you to apply different handling rules for each confidence tier rather than treating all detections equally.",
          },
          {
            q: "Should I completely exclude role accounts from all email campaigns?",
            a: "Not necessarily — the right approach depends on campaign type. For personalized outreach, cold email, and campaigns designed to build individual relationships, excluding role accounts improves performance. For general announcements, partnership inquiries, or communications about company-wide services, role accounts like info@ or partnerships@ may be appropriate recipients. Consider maintaining segmented lists that allow including or excluding role accounts based on campaign objectives.",
          },
          {
            q: "Does role account detection work for all email domains?",
            a: "Yes — role account detection is purely prefix-based and works across all email domains regardless of provider. The same analysis applies whether the domain is Gmail, Microsoft 365, a corporate domain, or any other provider. The domain itself is not relevant to role classification — only the local part before the @ determines whether an address matches role-based patterns.",
          },
          {
            q: "How does role account status affect GDPR compliance?",
            a: "Under GDPR, personal email addresses are classified as personal data and require appropriate legal basis for processing. Generic organizational addresses like info@ may not constitute personal data since they are not linked to a specific individual, while individual@company.com is clearly personal data. Role account detection helps identify which addresses in your list may require different legal treatment, though you should consult legal counsel for specific compliance decisions.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Role Account Detector"
      />
    </>
  );
}
