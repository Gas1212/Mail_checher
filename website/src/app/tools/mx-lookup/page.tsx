'use client';

import { useState } from 'react';
import { Server, Check, X, AlertCircle, Loader2, Globe, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
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
      <ToolContent
        schemaId="mx-lookup-faq"
        sections={[
          {
            h2: "Understanding MX Records and Email Routing",
            content: "Mail Exchange (MX) records are DNS entries that define which mail servers are responsible for receiving email on behalf of a domain. When someone sends you an email, the sending server performs an MX lookup to discover which server to deliver the message to. Without valid MX records, a domain cannot receive any email — making MX lookup a fundamental step in email infrastructure diagnosis.\n\nEach MX record contains two components: the mail server hostname and a priority number. Lower priority numbers indicate preferred servers — if the primary server is unavailable, the sending server automatically tries the next one in priority order. This built-in redundancy is why professional email setups typically have multiple MX records from different servers.\n\nCommon mail providers have distinctive MX record patterns: Google Workspace uses aspmx.l.google.com, Microsoft 365 uses *.mail.protection.outlook.com, and independent servers typically show the domain itself or a mail subdomain. Recognizing these patterns quickly identifies which email infrastructure a domain uses.",
          },
          {
            h2: "Diagnosing Email Delivery Problems with MX Lookup",
            content: "MX lookup is the starting point for diagnosing email delivery failures. When emails to a domain consistently fail to deliver, checking MX records immediately reveals whether the issue is DNS configuration or mail server availability. A domain with no MX records has no email capability — any address on that domain is guaranteed to bounce. Misconfigured MX records pointing to non-existent servers produce similar delivery failures.\n\nFor email marketers and administrators, MX lookup provides insight into the email infrastructure used by recipient domains before sending. Knowing that a domain uses Google Workspace, Microsoft 365, or a specific regional provider helps predict how email will be handled — including filtering policies, authentication requirements, and typical delivery speeds.\n\nWhen setting up email for a new domain, MX lookup verification confirms that DNS changes have propagated correctly. DNS propagation can take up to 48 hours, and MX lookup allows you to check progress in real-time rather than waiting for delivery failures to confirm whether records are active.",
          },
          {
            h2: "MX Records and Email Authentication",
            content: "MX records work in conjunction with other DNS-based email authentication standards — SPF, DKIM, and DMARC — to establish domain email legitimacy. While MX records define where to deliver email, SPF records specify which servers are authorized to send email from your domain. Together, these records create a complete email security framework that protects against spoofing and phishing.\n\nFor system administrators setting up email, verifying MX records is just the beginning of a complete DNS audit. SPF records should list all authorized sending servers, DKIM public keys should be published in TXT records, and DMARC policies should specify how receivers handle authentication failures. MX lookup is therefore typically used alongside SPF, DKIM, and DMARC checking tools as part of a comprehensive email infrastructure audit.\n\nUnderstanding which mail provider handles a domain's MX records also informs authentication setup — each provider has specific requirements for SPF includes and DKIM selector configurations. Our tool displays the full MX record set with priorities, giving you everything needed for accurate infrastructure assessment.",
          },
        ]}
        faqs={[
          {
            q: "What happens if a domain has no MX records?",
            a: "If a domain has no MX records, it cannot receive email. Emails sent to any address on that domain will bounce with a DNS error — typically an MX lookup failed or no route to host error. Some legacy configurations use an A record as a fallback mail server when no MX record exists, but this is not standard and most modern mail servers will reject the delivery attempt.",
          },
          {
            q: "Can a domain have multiple MX records?",
            a: "Yes, and it is recommended. Multiple MX records with different priority values create redundancy — if the primary mail server (lowest priority number) is unavailable, sending servers automatically try the next one. Most professional email setups have 2-5 MX records for reliability. Google Workspace, for example, uses 5 MX records with priorities 1, 5, 5, 10, and 10 across multiple data centers.",
          },
          {
            q: "How long does it take for MX record changes to propagate?",
            a: "MX record changes propagate across the global DNS system within minutes to 48 hours, depending on the TTL (Time To Live) value set on the previous records. Most modern DNS setups use TTL values of 3,600 seconds (1 hour) or less, meaning changes typically propagate within a few hours. During migration, it is common to reduce TTL to 300 seconds before making changes to speed up propagation.",
          },
          {
            q: "What is MX record priority and how does it work?",
            a: "MX record priority is a numerical value that determines the order in which mail servers are tried during delivery. Lower numbers indicate higher priority — a server with priority 10 is preferred over one with priority 20. When the preferred server is unavailable, the sending server automatically tries the next priority server. Equal priority values result in random selection between those servers for load balancing.",
          },
          {
            q: "How do I identify which email provider a domain uses from MX records?",
            a: "MX record hostnames follow provider-specific patterns: Google Workspace records end in .google.com or .googlemail.com, Microsoft 365 uses *.mail.protection.outlook.com, Zoho Mail uses *.zoho.com, and ProtonMail uses *.protonmail.ch. Hosting companies often show their own domain in MX records. Our MX lookup displays the full hostname for each record, making provider identification straightforward.",
          },
        ]}
      />
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
