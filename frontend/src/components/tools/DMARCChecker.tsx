'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function DMARCChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await securityToolsAPI.checkDMARC(domain);
      setResult(data);
    } catch (err) {
      setResult({ errors: ['Error checking DMARC record'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>DMARC Record Checker</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <Input
              label="Domain Name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
            />
            <Button type="submit" isLoading={loading}>Check DMARC</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>DMARC Status</CardTitle>
              <Badge variant={result.has_dmarc ? 'success' : 'error'}>
                {result.has_dmarc ? 'Found' : 'Not Found'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.dmarc_record && (
              <div>
                <p className="text-sm font-medium mb-1">Record:</p>
                <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                  {result.dmarc_record}
                </code>
              </div>
            )}
            {result.policy && <p className="text-sm"><strong>Policy:</strong> {result.policy}</p>}
            {result.rua && result.rua.length > 0 && (
              <p className="text-sm"><strong>Report Email:</strong> {result.rua.join(', ')}</p>
            )}
            {result.warnings?.map((w: string, i: number) => (
              <p key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">{w}</p>
            ))}
            {result.errors?.map((e: string, i: number) => (
              <p key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded">{e}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
