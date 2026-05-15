import React from 'react';
import { Button } from '../../../components/Button';

export const GoogleButton: React.FC = () => {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/auth/google';
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      className="google-button"
    >
      Continue with Google
    </Button>
  );
};

export default GoogleButton;
