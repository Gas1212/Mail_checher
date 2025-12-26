'use client';

import { useEffect, useState } from 'react';
import { emailAPI } from '@/lib/api';
import { EmailValidationResult } from '@/types';

export default function History() {
  const [history, setHistory] = useState<EmailValidationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchHistory();
  }, [limit]);

  const fetchHistory = async () => {
    try {
      const data = await emailAPI.getHistory(limit);
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Validation History</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-600">Show:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No validation history yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Syntax</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">DNS</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SMTP</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Disposable</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{item.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={item.is_valid_syntax ? 'text-green-600' : 'text-red-600'}>
                        {item.is_valid_syntax ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={item.is_valid_dns ? 'text-green-600' : 'text-red-600'}>
                        {item.is_valid_dns ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={item.is_valid_smtp ? 'text-green-600' : 'text-red-600'}>
                        {item.is_valid_smtp ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={item.is_disposable ? 'text-red-600' : 'text-green-600'}>
                        {item.is_disposable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {item.created_at ? formatDate(item.created_at) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
