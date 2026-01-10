'use client';

import { X, Zap, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAppUrl } from '@/lib/config';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export default function UpgradeModal({ isOpen, onClose, toolName }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Free Trial Limit Reached
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            You&apos;ve used all 3 free tries for <strong>{toolName}</strong>. Create a free account to continue using our tools with more features!
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {[
              '100 free validations per month',
              'Access to all tools',
              'Save your validation history',
              'API access (Pro plan)',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href={getAppUrl('/auth/signup')}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              href={getAppUrl('/auth/signin')}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              Already have an account? Sign In
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
