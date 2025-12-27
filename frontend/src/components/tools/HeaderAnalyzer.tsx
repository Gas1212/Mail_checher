'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function HeaderAnalyzer() {
  const [headers, setHeaders] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await securityToolsAPI.analyzeHeaders(headers);
      setResult(data);
    } catch (err) {
      setResult({ errors: ['Error analyzing headers'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Email Header Analyzer</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Headers
              </label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder="Paste email headers here..."
                rows={10}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" isLoading={loading}>Analyze Headers</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.summary && (
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><strong>From:</strong> {result.summary.from}</p>
                <p className="text-sm"><strong>To:</strong> {result.summary.to}</p>
                <p className="text-sm"><strong>Subject:</strong> {result.summary.subject}</p>
                <p className="text-sm"><strong>Date:</strong> {result.summary.date}</p>
              </CardContent>
            </Card>
          )}

          {result.authentication && (
            <Card>
              <CardHeader><CardTitle>Authentication</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">SPF:</span>
                  <Badge variant={result.authentication.spf === 'pass' ? 'success' : 'error'}>
                    {result.authentication.spf || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">DKIM:</span>
                  <Badge variant={result.authentication.dkim === 'pass' ? 'success' : 'warning'}>
                    {result.authentication.dkim || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">DMARC:</span>
                  <Badge variant={result.authentication.dmarc === 'pass' ? 'success' : 'warning'}>
                    {result.authentication.dmarc || 'N/A'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Warnings</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {result.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">{w}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
