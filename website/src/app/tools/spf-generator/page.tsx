'use client';

import { useState } from 'react';
import { Shield, Check, Copy, Loader2, Plus, X, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { useFreeTrial } from '@/hooks/useFreeTrial';

interface SPFResult {
  record: string;
  explanation: string;
  warnings: string[];
}

export default function SPFGeneratorPage() {
  const [domain, setDomain] = useState('');
  const [includeA, setIncludeA] = useState(false);
  const [includeMX, setIncludeMX] = useState(true);
  const [ip4Addresses, setIp4Addresses] = useState<string[]>(['']);
  const [includeDomains, setIncludeDomains] = useState<string[]>(['']);
  const [policy, setPolicy] = useState('~all');
  const [result, setResult] = useState<SPFResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { remainingTrials, hasExceededLimit, useOneTrial, isLoading } = useFreeTrial('spf-generator');

  const addIP4 = () => setIp4Addresses([...ip4Addresses, '']);
  const removeIP4 = (index: number) => setIp4Addresses(ip4Addresses.filter((_, i) => i !== index));
  const updateIP4 = (index: number, value: string) => {
    const newIPs = [...ip4Addresses];
    newIPs[index] = value;
    setIp4Addresses(newIPs);
  };

  const addInclude = () => setIncludeDomains([...includeDomains, '']);
  const removeInclude = (index: number) => setIncludeDomains(includeDomains.filter((_, i) => i !== index));
  const updateInclude = (index: number, value: string) => {
    const newDomains = [...includeDomains];
    newDomains[index] = value;
    setIncludeDomains(newDomains);
  };

  const generateSPF = async () => {
    // Check if user has exceeded limit
    if (hasExceededLimit) {
      setShowUpgradeModal(true);
      return;
    }

    if (!domain.trim()) {
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setCopied(false);

    // Simulate generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Build SPF record
    let spfParts = ['v=spf1'];

    if (includeA) {
      spfParts.push('a');
    }

    if (includeMX) {
      spfParts.push('mx');
    }

    // Add IPv4 addresses
    ip4Addresses.filter(ip => ip.trim()).forEach(ip => {
      spfParts.push(`ip4:${ip.trim()}`);
    });

    // Add include domains
    includeDomains.filter(d => d.trim()).forEach(includeDomain => {
      spfParts.push(`include:${includeDomain.trim()}`);
    });

    // Add policy
    spfParts.push(policy);

    const spfRecord = spfParts.join(' ');

    // Generate warnings
    const warnings: string[] = [];
    if (spfParts.length > 10) {
      warnings.push('SPF record is long. Consider consolidating to avoid DNS lookup limits.');
    }
    if (!includeMX && !includeA && ip4Addresses.filter(ip => ip.trim()).length === 0) {
      warnings.push('No mail servers specified. Your SPF record may not work as expected.');
    }
    if (policy === '-all') {
      warnings.push('Using strict policy (-all). This will reject all emails from unauthorized servers.');
    }

    const generatedResult: SPFResult = {
      record: spfRecord,
      explanation: `This SPF record authorizes ${includeMX ? 'MX servers' : 'specified servers'} to send email on behalf of ${domain}. Policy: ${policy === '~all' ? 'Soft fail' : policy === '-all' ? 'Hard fail' : 'Neutral'}.`,
      warnings,
    };

    setResult(generatedResult);
    setIsGenerating(false);

    // Use one trial
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTrialsLeft = useOneTrial();
    if (!hasTrialsLeft) {
      // Show modal after displaying result
      setTimeout(() => setShowUpgradeModal(true), 2000);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.record);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SPF Record Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate SPF (Sender Policy Framework) records for your domain. Protect against email spoofing and improve deliverability.
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
              <div className="space-y-6">
                {/* Domain */}
                <Input
                  label="Domain Name"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  disabled={isGenerating || hasExceededLimit}
                />

                {/* Mechanisms */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Authorization Mechanisms
                  </label>

                  {/* Include A Record */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeA"
                      checked={includeA}
                      onChange={(e) => setIncludeA(e.target.checked)}
                      disabled={isGenerating || hasExceededLimit}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="includeA" className="text-sm text-gray-700">
                      Include A record (domain&apos;s IP address)
                    </label>
                  </div>

                  {/* Include MX Record */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeMX"
                      checked={includeMX}
                      onChange={(e) => setIncludeMX(e.target.checked)}
                      disabled={isGenerating || hasExceededLimit}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="includeMX" className="text-sm text-gray-700">
                      Include MX records (mail servers)
                    </label>
                  </div>
                </div>

                {/* IPv4 Addresses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      IPv4 Addresses (optional)
                    </label>
                    <Button
                      onClick={addIP4}
                      variant="outline"
                      size="sm"
                      disabled={isGenerating || hasExceededLimit}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add IP
                    </Button>
                  </div>
                  {ip4Addresses.map((ip, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => updateIP4(index, e.target.value)}
                        placeholder="192.168.1.1"
                        disabled={isGenerating || hasExceededLimit}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      {ip4Addresses.length > 1 && (
                        <button
                          onClick={() => removeIP4(index)}
                          disabled={isGenerating || hasExceededLimit}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Include Domains */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Include Domains (e.g., email service providers)
                    </label>
                    <Button
                      onClick={addInclude}
                      variant="outline"
                      size="sm"
                      disabled={isGenerating || hasExceededLimit}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Domain
                    </Button>
                  </div>
                  {includeDomains.map((includeDomain, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={includeDomain}
                        onChange={(e) => updateInclude(index, e.target.value)}
                        placeholder="_spf.google.com"
                        disabled={isGenerating || hasExceededLimit}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      {includeDomains.length > 1 && (
                        <button
                          onClick={() => removeInclude(index)}
                          disabled={isGenerating || hasExceededLimit}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Policy */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SPF Policy
                  </label>
                  <select
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    disabled={isGenerating || hasExceededLimit}
                    className="w-full px-3 py-2.5 sm:px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white min-h-[44px]"
                  >
                    <option value="~all">~all (Soft Fail - Recommended)</option>
                    <option value="-all">-all (Hard Fail - Strict)</option>
                    <option value="?all">?all (Neutral)</option>
                    <option value="+all">+all (Pass All - Not Recommended)</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    Soft fail (~all) is recommended for most domains
                  </p>
                </div>

                <Button
                  onClick={generateSPF}
                  isLoading={isGenerating}
                  disabled={!domain.trim() || isGenerating || hasExceededLimit}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : hasExceededLimit ? (
                    'Free Trial Limit Reached'
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Generate SPF Record
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
                  {/* SPF Record */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Your SPF Record
                      </h3>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {result.record}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">What This Means:</p>
                        <p className="text-blue-800">{result.explanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-yellow-800">{warning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Installation Instructions */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Installation Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Log in to your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap)</li>
                      <li>Navigate to DNS management for {domain}</li>
                      <li>Add a new TXT record with the name &quot;@&quot; or your domain name</li>
                      <li>Paste the SPF record above as the value</li>
                      <li>Save the changes (DNS propagation may take up to 48 hours)</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About SPF Records
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>What is SPF?</strong> Sender Policy Framework is an email authentication protocol that helps prevent email spoofing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Why Use SPF?</strong> Protects your domain from being used in phishing attacks and improves email deliverability</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>DNS Lookup Limit:</strong> SPF records are limited to 10 DNS lookups. Use include wisely to avoid hitting this limit</p>
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
        toolName="SPF Generator"
      />
    </>
  );
}
