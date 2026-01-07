'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function DNSChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await securityToolsAPI.checkDNS(domain);
      setResult(data);
    } catch (err) {
      setResult({ errors: ['Error checking DNS records'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>DNS Record Checker</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <Input
              label="Domain Name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
            />
            <Button type="submit" isLoading={loading}>Check DNS Records</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.a_records && result.a_records.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">A Records (IPv4)</CardTitle></CardHeader>
              <CardContent>
                {result.a_records.map((r: string, i: number) => (
                  <p key={i} className="text-sm font-mono">{r}</p>
                ))}
              </CardContent>
            </Card>
          )}

          {result.mx_records && result.mx_records.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">MX Records</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {result.mx_records.map((r: any, i: number) => (
                  <p key={i} className="text-sm">
                    <span className="font-semibold">{r.priority}</span> - {r.server}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {result.ns_records && result.ns_records.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">NS Records</CardTitle></CardHeader>
              <CardContent>
                {result.ns_records.map((r: string, i: number) => (
                  <p key={i} className="text-sm font-mono">{r}</p>
                ))}
              </CardContent>
            </Card>
          )}

          {result.txt_records && result.txt_records.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-lg">TXT Records</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {result.txt_records.map((r: string, i: number) => (
                  <code key={i} className="block text-xs bg-gray-100 p-2 rounded break-all">{r}</code>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
