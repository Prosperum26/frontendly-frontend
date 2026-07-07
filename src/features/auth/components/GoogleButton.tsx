import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { ENV } from '../../../config/env';
import { Loader } from '../../../components/Loader/Loader';
import { useTheme } from 'next-themes';

interface GoogleButtonProps {
  rememberMe?: boolean;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ rememberMe = false }) => {
  const { handleGoogleLogin, isLoading } = useGoogleLogin(rememberMe);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  console.log('Google Client ID:', ENV.GOOGLE_CLIENT_ID);
  const isConfigured =
    ENV.GOOGLE_CLIENT_ID &&
    ENV.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
    ENV.GOOGLE_CLIENT_ID !== 'dummy_google_client_id' &&
    ENV.GOOGLE_CLIENT_ID !== 'your-google-client-id-here';
  console.log('Is Google Configured:', isConfigured);

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError('Google login failed. Please try again.');
  };

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Google credential received:', credentialResponse);
    setError(null);
    handleGoogleLogin(credentialResponse);
  };

  if (!isConfigured) {
    return (
      <div className="text-xs text-muted italic border border-dashed border-border p-3 rounded-lg">
        Google Login chưa được cấu hình Client ID.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      <div className="w-full flex flex-col items-center gap-2">
        {isLoading ? (
          <div className="w-full h-[40px] flex items-center justify-center border border-border rounded-md bg-main-bg">
            <Loader size="sm" />
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            type="standard"
            theme={theme === 'dark' ? 'filled_blue' : 'outline'}
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
