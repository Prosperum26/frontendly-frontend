import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { ENV } from '../../../config/env';

export const GoogleButton: React.FC = () => {
  const { handleGoogleLogin } = useGoogleLogin();

  const isConfigured = ENV.GOOGLE_CLIENT_ID && 
                      ENV.GOOGLE_CLIENT_ID !== 'your-google-client-id' && 
                      ENV.GOOGLE_CLIENT_ID !== 'dummy_google_client_id';

  if (!isConfigured) {
    return (
      <div className="text-xs text-slate-400 italic border border-dashed border-slate-200 p-3 rounded-lg">
        Google Login chưa được cấu hình Client ID.
      </div>
    );
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
