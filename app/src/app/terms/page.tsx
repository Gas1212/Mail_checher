'use client';

import { useEffect } from 'react';

export default function TermsRedirect() {
  useEffect(() => {
    // Redirect to main website terms page
    window.location.href = 'https://sugesto.xyz/terms';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Terms of Service...</p>
      </div>
    </div>
  );
}
