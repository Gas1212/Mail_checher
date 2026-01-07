'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAppUrl } from '@/lib/config';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Mail,
  User,
  Server,
  Shield,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SPFResult {
  spf_record: string;
  dns_record: string;
  warnings: string[];
  explanation: {
    mechanisms: { [key: string]: string };
    policy: string;
  };
  installation_steps: string[];
}

export default function SPFGeneratorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [includeA, setIncludeA] = useState(false);
  const [includeMX, setIncludeMX] = useState(true);
  const [ip4Addresses, setIp4Addresses] = useState<string[]>(['']);
  const [ip6Addresses, setIp6Addresses] = useState<string[]>([]);
  const [includeDomains, setIncludeDomains] = useState<string[]>(['']);
  const [policy, setPolicy] = useState('~all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SPFResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const addIP4 = () => setIp4Addresses([...ip4Addresses, '']);
  const removeIP4 = (index: number) => setIp4Addresses(ip4Addresses.filter((_, i) => i !== index));
  const updateIP4 = (index: number, value: string) => {
    const newIPs = [...ip4Addresses];
    newIPs[index] = value;
    setIp4Addresses(newIPs);
  };

  const addIP6 = () => setIp6Addresses([...ip6Addresses, '']);
  const removeIP6 = (index: number) => setIp6Addresses(ip6Addresses.filter((_, i) => i !== index));
  const updateIP6 = (index: number, value: string) => {
    const newIPs = [...ip6Addresses];
    newIPs[index] = value;
    setIp6Addresses(newIPs);
  };

  const addInclude = () => setIncludeDomains([...includeDomains, '']);
  const removeInclude = (index: number) => setIncludeDomains(includeDomains.filter((_, i) => i !== index));
  const updateInclude = (index: number, value: string) => {
    const newDomains = [...includeDomains];
    newDomains[index] = value;
    setIncludeDomains(newDomains);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/generate-spf/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          a_record: includeA,
          mx_record: includeMX,
          ip4_addresses: ip4Addresses.filter(ip => ip.trim()),
          ip6_addresses: ip6Addresses.filter(ip => ip.trim()),
          include_domains: includeDomains.filter(d => d.trim()),
          policy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'SPF generation failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sugesto
            </h1>
          </Link>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.first_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <Link href={getAppUrl("/dashboard")} className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Email Validation Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Validation
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/email-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-5 h-5" />
                <span>Single Checker</span>
              </Link>
              <Link
                href="/tools/bulk-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Mail className="w-5 h-5" />
                <span>Bulk Checker</span>
              </Link>
              <Link
                href="/tools/mx-lookup"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Server className="w-5 h-5" />
                <span>MX Lookup</span>
              </Link>
              <Link
                href="/tools/role-detector"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-5 h-5" />
                <span>Role Detector</span>
              </Link>
              <Link
                href="/tools/list-cleaner"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Sparkles className="w-5 h-5" />
                <span>List Cleaner</span>
              </Link>
            </div>
          </div>

          {/* Email Security Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email Security
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/spf-generator"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600"
              >
                <Shield className="w-5 h-5" />
                <span>SPF Generator</span>
              </Link>
              <Link
                href="/tools/blacklist-checker"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Blacklist Checker</span>
              </Link>
            </div>
          </div>

          {/* SEO Tools Category */}
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SEO Tools
            </div>
            <div className="space-y-1 mt-1">
              <Link
                href="/tools/sitemap-validator"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Sitemap Validator</span>
              </Link>
              <Link
                href="/tools/sitemap-finder"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
                <span>Sitemap Finder</span>
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="pt-2 border-t border-gray-200">
            <Link
              href={getAppUrl("/dashboard/settings")}
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SPF Record Generator</h1>
            <p className="text-gray-600 mt-1">Create SPF records to authenticate your email sending sources</p>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Tool - No Credits Required</p>
                  <p className="text-blue-700">SPF (Sender Policy Framework) helps prevent email spoofing by defining which mail servers are authorized to send email for your domain.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Configure SPF Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <Input
                  label="Domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  required
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Mechanisms</label>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeA}
                      onChange={(e) => setIncludeA(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-700">Include A record (domain IP address)</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeMX}
                      onChange={(e) => setIncludeMX(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-700">Include MX records (mail server IPs)</label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">IPv4 Addresses</label>
                    <button type="button" onClick={addIP4} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Add IP
                    </button>
                  </div>
                  {ip4Addresses.map((ip, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => updateIP4(index, e.target.value)}
                        placeholder="192.168.1.1"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {ip4Addresses.length > 1 && (
                        <button type="button" onClick={() => removeIP4(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {ip6Addresses.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">IPv6 Addresses</label>
                    </div>
                    {ip6Addresses.map((ip, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => updateIP6(index, e.target.value)}
                          placeholder="2001:0db8:85a3::8a2e:0370:7334"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button type="button" onClick={() => removeIP6(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={addIP6} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Add IPv6 Address
                </button>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Include Domains (e.g., _spf.google.com)</label>
                    <button type="button" onClick={addInclude} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Domain
                    </button>
                  </div>
                  {includeDomains.map((domain, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => updateInclude(index, e.target.value)}
                        placeholder="_spf.google.com"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {includeDomains.length > 1 && (
                        <button type="button" onClick={() => removeInclude(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy</label>
                  <select
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="~all">~all (Soft Fail - Recommended)</option>
                    <option value="-all">-all (Hard Fail - Strict)</option>
                    <option value="?all">?all (Neutral - Testing)</option>
                    <option value="+all">+all (Pass All - Not Recommended)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    ~all is recommended for most domains. It marks unauthorized emails as spam instead of rejecting them.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" isLoading={loading} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Generate SPF Record
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated SPF Record</CardTitle>
                    <button
                      onClick={() => copyToClipboard(result.spf_record)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm break-all">
                    {result.spf_record}
                  </div>
                </CardContent>
              </Card>

              {result.warnings && result.warnings.length > 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-900">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-orange-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Installation Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">DNS Record Format:</p>
                      <pre className="text-sm text-blue-800 font-mono overflow-x-auto">
                        {result.dns_record}
                      </pre>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Steps:</p>
                      <ol className="space-y-2">
                        {result.installation_steps && result.installation_steps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="font-medium mr-2 text-indigo-600">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Mechanisms:</p>
                      <div className="space-y-2">
                        {result.explanation?.mechanisms && Object.entries(result.explanation.mechanisms).map(([key, value]) => (
                          <div key={key} className="flex items-start space-x-2 text-sm">
                            <code className="px-2 py-0.5 bg-gray-100 rounded text-indigo-600">{key}</code>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Policy:</p>
                      <p className="text-sm text-gray-600">{result.explanation.policy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
