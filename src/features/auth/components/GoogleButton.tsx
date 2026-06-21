import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { ENV } from '../../../config/env';
import { Loader } from '../../../components/Loader/Loader';

export const GoogleButton: React.FC = () => {
  const { handleGoogleLogin, isLoading } = useGoogleLogin();
  const [error, setError] = useState<string | null>(null);

  const isConfigured = ENV.GOOGLE_CLIENT_ID && 
                      ENV.GOOGLE_CLIENT_ID !== 'your-google-client-id' && 
                      ENV.GOOGLE_CLIENT_ID !== 'dummy_google_client_id';

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
    console.error('Google Login Failed');
  };

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null);
    handleGoogleLogin(credentialResponse);
  };

  if (!isConfigured) {
    return (
      <div className="text-xs text-slate-400 italic border border-dashed border-slate-200 p-3 rounded-lg">
        Google Login chưa được cấu hình Client ID.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      <div className="w-full flex flex-col items-center gap-2">
        {isLoading ? (
          <div className="w-full h-[40px] flex items-center justify-center border border-slate-300 rounded-md bg-white">
            <Loader size="sm" />
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        )}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
