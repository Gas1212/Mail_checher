'use client';

import { CreditCard, Clock, AlertCircle } from 'lucide-react';
import Badge from './Badge';

interface CreditsDisplayProps {
  available: number;
  total: number;
  used: number;
  isRateLimited?: boolean;
  rateLimitReset?: number;
  rateLimit?: {
    requests: number;
    window: number;
    current: number;
  };
  className?: string;
}

export default function CreditsDisplay({
  available,
  total,
  used,
  isRateLimited = false,
  rateLimitReset = 0,
  rateLimit,
  className = '',
}: CreditsDisplayProps) {
  const percentage = (available / total) * 100;
  const now = Date.now();
  const secondsUntilReset = Math.max(0, Math.ceil((rateLimitReset - now) / 1000));

  const getStatusColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    if (isRateLimited) {
      return <Badge variant="warning">Rate Limited</Badge>;
    }
    if (available === 0) {
      return <Badge variant="error">No Credits</Badge>;
    }
    if (percentage < 20) {
      return <Badge variant="warning">Low Credits</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">Global Credits</h3>
        </div>
        {getStatusBadge()}
      </div>

      {/* Credits Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Credits</span>
          <span className="font-semibold text-gray-900">
            {available} / {total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Used: {used}</span>
          <span>{percentage.toFixed(0)}% remaining</span>
        </div>
      </div>

      {/* Rate Limit Info */}
      {rateLimit && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Rate Limit</span>
            </div>
            <span className="text-gray-900 font-medium">
              {rateLimit.current} / {rateLimit.requests} per min
            </span>
          </div>

          {isRateLimited && secondsUntilReset > 0 && (
            <div className="mt-2 flex items-start space-x-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Rate limit reached</p>
                <p>Please wait {secondsUntilReset} seconds before next request</p>
              </div>
            </div>
          )}

          {available === 0 && (
            <div className="mt-2 flex items-start space-x-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No credits available</p>
                <p>Credits will reset at the beginning of next month</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reset Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Monthly allocation:</span> {total} credits (shared across all tools)
          <br />
          <span className="font-medium">Resets:</span> First day of each month
        </p>
      </div>
    </div>
  );
}
