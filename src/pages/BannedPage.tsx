import React from 'react';

export const BannedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Account Banned</h1>
        <p className="text-slate-600 mb-6">
          Your account has been banned due to violation of our terms of service. If you believe this is an error,
          please contact our support team.
        </p>
        <button
          onClick={() => (window.location.href = 'mailto:support@frontendly.com')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default BannedPage;
