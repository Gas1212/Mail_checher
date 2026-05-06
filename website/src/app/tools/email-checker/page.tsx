'use client';

import { useState } from 'react';
import { Mail, Check, X, AlertCircle, Loader2, Zap, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import RelatedTools from '@/components/tools/RelatedTools';

interface ValidationResult {
  email: string;
  isValid: boolean;
  checks: {
    syntax: boolean;
    domain: boolean;
    mx: boolean;
    disposable: boolean;
  };
  message: string;
}

export default function EmailCheckerPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('email-checker');

  const validateEmail = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!email.trim()) {
      return;
    }

    setIsValidating(true);
    setResult(null);

    try {
      // Call real API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/validate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, check_smtp: true }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data = await response.json();

      // Map API response to ValidationResult
      const validationResult: ValidationResult = {
        email,
        isValid: data.is_valid || false,
        checks: {
          syntax: data.syntax_valid || false,
          domain: data.domain_valid || false,
          mx: data.mx_valid || false,
          disposable: !data.is_disposable || false,
        },
        message: data.is_valid
          ? 'Email is valid and deliverable'
          : data.reason || 'Email has validation issues',
      };

      setResult(validationResult);

      // Use one trial
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const hasTrialsLeft = consumeTrial();
      if (!hasTrialsLeft) {
        // Show modal after displaying result
        setTimeout(() => setShowUpgradeModal(true), 2000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      // Fallback to basic validation on error
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const syntaxValid = emailRegex.test(email);
      const hasDomain = email.includes('@') && email.split('@')[1]?.includes('.');

      const validationResult: ValidationResult = {
        email,
        isValid: false,
        checks: {
          syntax: syntaxValid,
          domain: hasDomain,
          mx: false,
          disposable: false,
        },
        message: 'Validation service temporarily unavailable',
      };

      setResult(validationResult);
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateEmail();
    }
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
              Email Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Verify email addresses with comprehensive checks including syntax, DNS, MX records, and disposable detection.
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
                  disabled={isValidating || hasExceededLimit}
                />

                <Button
                  onClick={validateEmail}
                  isLoading={isValidating}
                  disabled={!email.trim() || isValidating || hasExceededLimit}
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
                      Validate Email
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
                        Validation Result
                      </h3>
                      <p className="text-gray-600">{result.email}</p>
                    </div>
                    <div>
                      {result.isValid ? (
                        <Badge variant="success" className="text-base px-4 py-2">
                          <Check className="w-4 h-4 mr-2" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-base px-4 py-2">
                          <X className="w-4 h-4 mr-2" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Detailed Checks */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Validation Checks:</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CheckItem
                        label="Syntax Check"
                        passed={result.checks.syntax}
                        description="Email format is correct"
                      />
                      <CheckItem
                        label="Domain Verification"
                        passed={result.checks.domain}
                        description="Domain exists and is valid"
                      />
                      <CheckItem
                        label="MX Records"
                        passed={result.checks.mx}
                        description="Mail server is configured"
                      />
                      <CheckItem
                        label="Disposable Check"
                        passed={result.checks.disposable}
                        description="Not a temporary email"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`p-4 rounded-lg ${result.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-start space-x-3">
                      {result.isValid ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      )}
                      <p className={result.isValid ? 'text-green-800' : 'text-yellow-800'}>
                        {result.message}
                      </p>
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
                What We Check
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Syntax Validation:</strong> Ensures the email follows RFC 5322 standards</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Domain Verification:</strong> Confirms the domain exists and has valid DNS records</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>MX Records:</strong> Verifies mail exchange servers are properly configured</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Disposable Detection:</strong> Identifies temporary or disposable email services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RelatedTools
        tools={[
          {
            name: 'Bulk Email Checker',
            description: 'Validate multiple emails at once',
            href: '/tools/bulk-checker',
            icon: Zap,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            name: 'MX Lookup',
            description: 'Check mail exchange records',
            href: '/tools/mx-lookup',
            icon: Shield,
            color: 'from-green-500 to-emerald-500',
          },
          {
            name: 'All Tools',
            description: 'Explore our complete toolset',
            href: '/tools',
            icon: Mail,
            color: 'from-indigo-500 to-purple-500',
          },
        ]}
      />

      <ToolContent
        schemaId="email-checker-faq"
        sections={[
          {
            h2: "How Email Validation Works",
            content: "Email validation is a systematic process that verifies whether an email address is genuine, reachable, and safe to contact. It begins with syntax analysis, confirming the address follows RFC 5321 format rules. Next, DNS queries check that the domain has active MX records — the server addresses that receive incoming mail. Without valid MX records, no message can ever be delivered to that address.\n\nThe most powerful step is SMTP verification: our tool connects to the recipient mail server and simulates a delivery handshake without sending any actual email. The server response reveals whether the specific mailbox exists and is accepting messages. This step alone eliminates the majority of hard bounces before they happen.\n\nAdditionally, the checker scans against databases of known disposable email providers — services that generate temporary addresses used to bypass sign-up requirements. Catching these ensures your list contains only genuine contacts who want to receive your communications.",
          },
          {
            h2: "Why High Bounce Rates Damage Your Sender Reputation",
            content: "Email service providers — including Mailchimp, SendGrid, and Amazon SES — continuously monitor your bounce rates. When invalid addresses consistently bounce, ISPs interpret this as a signal that you are not managing your list responsibly. A bounce rate above 2% triggers warnings, and rates above 5% can cause account suspension, cutting off all email marketing capabilities.\n\nBeyond account health, bounce rates directly affect inbox placement for your valid subscribers. ISPs use engagement signals to decide whether your emails land in the inbox or spam folder. High bounce percentages lower your sender score, meaning even your legitimate emails face increased scrutiny. This creates a cascading problem where poor list hygiene affects your entire audience, not just the invalid addresses.\n\nCleaning your list with email validation removes invalid contacts before sending, protecting your sender reputation and ensuring your important messages reach people who want them. Lower bounce rates translate directly into better deliverability, higher open rates, and more effective campaigns.",
          },
          {
            h2: "Best Practices for Maintaining a Clean Email List",
            content: "The most effective approach combines real-time validation at the point of email capture with periodic bulk verification of your existing database. Validating at sign-up forms prevents bad data from entering your system in the first place — catching typos like @gmial.com or @yahooo.com immediately, before they propagate through your CRM and marketing tools.\n\nFor existing lists, quarterly validation is the recommended baseline for active marketing databases. Higher-frequency senders should validate monthly. Always validate before importing contacts from external sources, after periods of inactivity, or before major campaign launches where deliverability is critical.\n\nSegmentation based on validation results gives you granular control. Keep confirmed valid addresses in your primary sending segments. Handle catch-all domain addresses separately — they may be valid but cannot be individually confirmed. Remove hard invalids immediately and set up automated suppression for addresses that hard bounce after sending. This systematic approach keeps your list healthy without requiring manual intervention.",
          },
        ]}
        faqs={[
          {
            q: "What is the difference between a hard bounce and a soft bounce?",
            a: "A hard bounce means the email is permanently undeliverable — the address does not exist, the domain is invalid, or the server has blocked delivery permanently. A soft bounce is temporary, caused by a full mailbox, server downtime, or message size limits. Email validation primarily prevents hard bounces by identifying invalid addresses before sending. Addresses that soft bounce repeatedly should also be suppressed, as they represent unreachable contacts.",
          },
          {
            q: "Can the validator check Gmail, Outlook, and Yahoo addresses?",
            a: "Major providers like Gmail, Yahoo, and Outlook block SMTP verification probes to prevent user enumeration. Our validator confirms these domains are valid and properly configured, but cannot verify individual mailbox existence via SMTP. These addresses are returned as unknown or accept-all. Domain-level checks still catch common typos like @gmai.com or @outook.com, eliminating a significant portion of errors.",
          },
          {
            q: "What is a catch-all email domain?",
            a: "A catch-all or accept-all domain accepts every email sent to it, regardless of whether the specific mailbox exists. This makes per-address SMTP verification impossible since the server always responds positively. Catch-all addresses are common in corporate email setups. Our validator flags these so you can decide how to handle them — typically worth keeping for established company domains but safer to suppress for unknown domains.",
          },
          {
            q: "How does disposable email detection work?",
            a: "Our validator maintains a continuously updated database of 2,000+ known disposable email domains including Mailinator, Guerrilla Mail, 10MinuteMail, and hundreds of others. When an email address matches a known disposable domain, it is flagged immediately without needing SMTP verification. We update this database regularly as new disposable services emerge, ensuring high detection rates for newly created throwaway services.",
          },
          {
            q: "How accurate is email validation?",
            a: "Our email validator achieves approximately 95-98% accuracy for deliverability prediction. Uncertainty comes mainly from catch-all domains and major consumer providers that block SMTP probes. For B2B lists with corporate domains, accuracy is typically higher at 97-99% since most corporate mail servers respond to verification. We continuously update our detection algorithms and databases to maintain accuracy as email infrastructure evolves.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Email Validator"
      />
    </>
  );
}

interface CheckItemProps {
  label: string;
  passed: boolean;
  description: string;
}

function CheckItem({ label, passed, description }: CheckItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
        {passed ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <X className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
