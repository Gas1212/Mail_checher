'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Shield, AlertTriangle } from 'lucide-react';

export default function PhishingChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await securityToolsAPI.checkPhishing(url);
      setResult(data);
    } catch (err) {
      setResult({ error: 'Error checking URL' });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return 'text-green-600';
    if (score < 40) return 'text-yellow-600';
    if (score < 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Phishing Link Checker</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <Input
              label="URL to Check"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/login"
              required
            />
            <Button type="submit" isLoading={loading}>Check URL</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Result</CardTitle>
                <Badge variant={result.is_safe ? 'success' : 'error'}>
                  {result.is_safe ? (
                    <><Shield className="w-3 h-3 mr-1 inline" />Safe</>
                  ) : (
                    <><AlertTriangle className="w-3 h-3 mr-1 inline" />Suspicious</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Risk Score</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        result.risk_score < 40 ? 'bg-green-500' :
                        result.risk_score < 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getRiskColor(result.risk_score)}`}>
                    {result.risk_score}/100
                  </span>
                </div>
              </div>

              {result.threats && result.threats.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-red-700">Threats:</p>
                  <div className="space-y-1">
                    {result.threats.map((t: string, i: number) => (
                      <p key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded">{t}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.warnings && result.warnings.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-yellow-700">Warnings:</p>
                  <div className="space-y-1">
                    {result.warnings.map((w: string, i: number) => (
                      <p key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">{w}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.analysis && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 mb-2">Technical Details:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><strong>Domain:</strong> {result.analysis.domain}</p>
                    <p><strong>Protocol:</strong> {result.analysis.scheme}</p>
                    <p><strong>Length:</strong> {result.analysis.length} chars</p>
                    <p><strong>Subdomains:</strong> {result.analysis.subdomain_count}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
