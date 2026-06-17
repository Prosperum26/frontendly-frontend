import { useMutation } from '@tanstack/react-query';
import type { CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useToast } from '../../../components/Toast';

export const useGoogleLogin = () => {
  const { setAuth, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToast();

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
      addToast('Login Successful', 'You have been successfully logged in.', 'success');
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        addToast('Unauthorized', 'Invalid Google credentials. Please try again.', 'error');
        logout();
      } else if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 15;
        addToast('Too Many Attempts', `Too many login attempts. Please try again in ${retryAfter} minutes.`, 'alert');
      } else if (error.response?.status === 403) {
        addToast('Account Banned', 'Your account has been banned. Please contact support.', 'error');
        logout();
        window.location.href = '/banned';
      } else {
        addToast('Login Failed', 'Unable to log in with Google. Please try again.', 'error');
      }
    },
  });

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    // Handle re-login scenario: if user is already authenticated, logout first
    if (isAuthenticated) {
      logout();
    }
    googleLoginMutation.mutate(credentialResponse);
  };

  return { handleGoogleLogin, isLoading: googleLoginMutation.isPending };
};

export default useGoogleLogin;
