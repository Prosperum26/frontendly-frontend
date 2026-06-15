import { useMutation } from '@tanstack/react-query';
import type { CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useState } from 'react';

export const useGoogleLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const googleLoginMutation = useMutation({
    mutationFn: async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      const response = await authService.googleLogin({
        idToken: credentialResponse.credential,
      });
      return response;
    },
    onSuccess: (response) => {
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setAuth(true, response.user ?? null);
      setNotification({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    },
    onError: () => {
      setNotification({ message: 'Login failed. Please try again.', type: 'error' });
    },
  });

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    googleLoginMutation.mutate(credentialResponse);
  };

  return { handleGoogleLogin, isLoading: googleLoginMutation.isPending, notification, setNotification };
};

export default useGoogleLogin;
