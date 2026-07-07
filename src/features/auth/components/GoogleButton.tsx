import React, { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { Loader } from '../../../components/Loader/Loader';
import { useTheme } from 'next-themes';

export const GoogleButton: React.FC = () => {
  const { handleGoogleLogin, isLoading } = useGoogleLogin();
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
    console.error('Google Login Failed');
  };

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null);
    handleGoogleLogin(credentialResponse);
  };

  return (
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
  );
};

export default GoogleButton;
