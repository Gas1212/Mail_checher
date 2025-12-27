'use client';

import { useState } from 'react';
import { securityToolsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { FileType, Shield, Mail, Key, CheckCircle } from 'lucide-react';

export default function TXTChecker() {
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
      const data = await securityToolsAPI.checkTXT(domain);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error checking TXT records');
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'SPF':
        return <Shield className="w-4 h-4" />;
      case 'DMARC':
        return <Mail className="w-4 h-4" />;
      case 'DKIM':
        return <Key className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const renderRecordCategory = (title: string, records: any[], icon: any, color: string) => {
    if (!records || records.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="info">{records.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.map((record: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {getIconForType(record.type)}
                <span className="font-semibold text-sm">{record.type}</span>
                {record.description && (
                  <span className="text-xs text-gray-600">- {record.description}</span>
                )}
              </div>
              <code className="block text-xs bg-white p-2 rounded border border-gray-200 break-all">
                {record.record}
              </code>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TXT Record Checker</CardTitle>
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
              Check TXT Records
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
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
                <CardTitle>TXT Records Summary</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={result.has_txt ? 'success' : 'warning'}>
                    {result.has_txt ? `${result.record_count} Records Found` : 'No Records'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {result.spf_records?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">SPF Records</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {result.dmarc_records?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">DMARC Records</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {result.dkim_records?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">DKIM Records</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {result.verification_records?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Verification</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {renderRecordCategory(
            'SPF Records',
            result.spf_records,
            <Shield className="w-5 h-5 text-blue-600" />,
            'blue'
          )}

          {renderRecordCategory(
            'DMARC Records',
            result.dmarc_records,
            <Mail className="w-5 h-5 text-green-600" />,
            'green'
          )}

          {renderRecordCategory(
            'DKIM Records',
            result.dkim_records,
            <Key className="w-5 h-5 text-purple-600" />,
            'purple'
          )}

          {renderRecordCategory(
            'Verification Records',
            result.verification_records,
            <CheckCircle className="w-5 h-5 text-orange-600" />,
            'orange'
          )}

          {renderRecordCategory(
            'Other TXT Records',
            result.other_records,
            <FileType className="w-5 h-5 text-gray-600" />,
            'gray'
          )}

          {result.warnings && result.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Warnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                    {w}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {result.errors && result.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Errors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.errors.map((e: string, i: number) => (
                  <p key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                    {e}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
