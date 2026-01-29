'use client';

import { useState } from 'react';
import { Server, Check, X, AlertCircle, Loader2, Globe, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface MXRecord {
  priority: number;
  exchange: string;
}

interface LookupResult {
  domain: string;
  hasMX: boolean;
  mxRecords: MXRecord[];
  hasValidDNS: boolean;
  message: string;
}

export default function MXLookupPage() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, consumeTrial, isLoading } = useFreeTrial('mx-lookup');

  const checkMXRecords = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!domain.trim()) {
      return;
    }

    setIsChecking(true);
    setResult(null);

    // Simulate MX lookup (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clean domain input
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    // Simulate MX records (in production, this would be an actual DNS lookup)
    const simulatedMXRecords: MXRecord[] = [
      { priority: 10, exchange: `mail.${cleanDomain}` },
      { priority: 20, exchange: `mail2.${cleanDomain}` },
    ];

    const lookupResult: LookupResult = {
      domain: cleanDomain,
      hasMX: true,
      mxRecords: simulatedMXRecords,
      hasValidDNS: true,
      message: simulatedMXRecords.length > 0
        ? `Found ${simulatedMXRecords.length} MX record${simulatedMXRecords.length > 1 ? 's' : ''} for ${cleanDomain}`
        : `No MX records found for ${cleanDomain}`,
    };

    setResult(lookupResult);
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
      checkMXRecords();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6">
              <Server className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              MX Record Lookup
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check mail exchange (MX) records and DNS configuration for any domain. Verify email server setup instantly.
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
                  label="Domain Name"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="example.com"
                  disabled={isChecking || hasExceededLimit}
                />

                <Button
                  onClick={checkMXRecords}
                  isLoading={isChecking}
                  disabled={!domain.trim() || isChecking || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Server className="w-5 h-5 mr-2" />
                      Check MX Records
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
                        MX Records for {result.domain}
                      </h3>
                      <p className="text-gray-600">{result.message}</p>
                    </div>
                    <div>
                      {result.hasMX ? (
                        <Badge variant="success" className="text-base px-4 py-2">
                          <Check className="w-4 h-4 mr-2" />
                          Found
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-base px-4 py-2">
                          <X className="w-4 h-4 mr-2" />
                          Not Found
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* MX Records List */}
                  {result.mxRecords.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Mail Exchange Records:</h4>
                      <div className="space-y-3">
                        {result.mxRecords.map((record, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Server className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{record.exchange}</p>
                                <p className="text-sm text-gray-600">Mail server hostname</p>
                              </div>
                            </div>
                            <Badge variant="default" className="text-sm">
                              Priority: {record.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DNS Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        result.hasValidDNS ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.hasValidDNS ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">DNS Configuration</p>
                        <p className="text-sm text-gray-600">Domain has valid DNS records</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        result.hasMX ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.hasMX ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Mail Server</p>
                        <p className="text-sm text-gray-600">
                          {result.hasMX ? 'Email delivery configured' : 'No email server found'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className={`p-4 rounded-lg ${
                    result.hasMX ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {result.hasMX ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      )}
                      <p className={result.hasMX ? 'text-green-800' : 'text-yellow-800'}>
                        {result.hasMX
                          ? 'This domain is properly configured to receive emails. Lower priority numbers are preferred.'
                          : 'This domain may not be able to receive emails. Check your DNS configuration.'}
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
                What are MX Records?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Mail Exchange (MX) Records:</strong> DNS records that specify the mail servers responsible for accepting email messages on behalf of a domain</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Server className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Priority Levels:</strong> Lower numbers indicate higher priority. Mail is sent to the server with the lowest priority number first</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Email Deliverability:</strong> Proper MX records are essential for receiving emails at your domain</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Redundancy:</strong> Multiple MX records provide backup mail servers if the primary server is unavailable</p>
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
        toolName="MX Lookup"
      />
    </>
  );
}
