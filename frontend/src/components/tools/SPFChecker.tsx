'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function SPFChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await securityToolsAPI.checkSPF(domain);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error checking SPF record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SPF Record Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <Input
              label="Domain Name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
            />
            <Button type="submit" isLoading={loading}>
              Check SPF Record
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SPF Record Status</CardTitle>
                <Badge variant={result.has_spf ? 'success' : 'error'}>
                  {result.has_spf ? 'SPF Found' : 'No SPF'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.spf_record && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">SPF Record:</p>
                  <code className="block p-3 bg-gray-100 rounded text-sm break-all">
                    {result.spf_record}
                  </code>
                </div>
              )}

              {result.mechanisms && result.mechanisms.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Mechanisms:</p>
                  <div className="space-y-2">
                    {result.mechanisms.map((m: any, i: number) => (
                      <div key={i} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                        <Badge variant="info" className="mt-0.5">
                          {m.qualifier}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{m.mechanism}</p>
                          <p className="text-xs text-gray-600">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.all_mechanism && (
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium text-blue-900">Policy:</p>
                  <p className="text-sm text-blue-700">{result.all_mechanism.policy}</p>
                </div>
              )}

              {result.warnings && result.warnings.length > 0 && (
                <div className="space-y-2">
                  {result.warnings.map((warning: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{warning}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  {result.errors.map((err: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                      <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">{err}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
