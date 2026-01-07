'use client';

import { useState } from 'react';
import { emailAPI } from '@/lib/api';
import { EmailValidationResult } from '@/types';

export default function EmailChecker() {
  const [email, setEmail] = useState('');
  const [checkSmtp, setCheckSmtp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await emailAPI.checkEmail({ email, check_smtp: checkSmtp });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while checking the email');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? '✓' : '✗';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Checker</h1>
        <p className="text-gray-600 mb-6">Validate email addresses with comprehensive checks</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-gray-800"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="checkSmtp"
              checked={checkSmtp}
              onChange={(e) => setCheckSmtp(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="checkSmtp" className="ml-2 block text-sm text-gray-700">
              Perform SMTP verification (slower but more thorough)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Email'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Validation Results</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email:</span>
                  <span className="font-medium text-gray-900">{result.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Syntax Valid:</span>
                  <span className={`font-semibold ${getStatusColor(result.is_valid_syntax)}`}>
                    {getStatusIcon(result.is_valid_syntax)} {result.is_valid_syntax ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">DNS Valid:</span>
                  <span className={`font-semibold ${getStatusColor(result.is_valid_dns)}`}>
                    {getStatusIcon(result.is_valid_dns)} {result.is_valid_dns ? 'Yes' : 'No'}
                  </span>
                </div>

                {checkSmtp && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">SMTP Valid:</span>
                    <span className={`font-semibold ${getStatusColor(result.is_valid_smtp)}`}>
                      {getStatusIcon(result.is_valid_smtp)} {result.is_valid_smtp ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Disposable:</span>
                  <span className={`font-semibold ${getStatusColor(!result.is_disposable)}`}>
                    {getStatusIcon(!result.is_disposable)} {result.is_disposable ? 'Yes' : 'No'}
                  </span>
                </div>

                {result.mx_records && result.mx_records.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">MX Records:</span>
                    <ul className="mt-1 ml-4 text-sm text-gray-600 space-y-1">
                      {result.mx_records.map((record, index) => (
                        <li key={index} className="list-disc">{record}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={`mt-4 p-3 rounded-lg ${
                result.is_valid_syntax && result.is_valid_dns
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  result.is_valid_syntax && result.is_valid_dns
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {result.validation_message}
                </p>
              </div>

              {result.details && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Detailed Information:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>Syntax:</strong> {result.details.syntax}</li>
                    <li><strong>DNS:</strong> {result.details.dns}</li>
                    {result.details.smtp && <li><strong>SMTP:</strong> {result.details.smtp}</li>}
                    <li><strong>Disposable:</strong> {result.details.disposable}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
