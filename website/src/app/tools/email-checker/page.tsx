'use client';

import { useState } from 'react';
import { Mail, Check, X, AlertCircle, Loader2, Zap, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
