import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { ENV } from '../../../config/env';

export const GoogleButton: React.FC = () => {
  const { handleGoogleLogin } = useGoogleLogin();

  if (!ENV.GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID is not configured');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.error('Google Login Failed')}
          useOneTap={false}
          type="standard"
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
