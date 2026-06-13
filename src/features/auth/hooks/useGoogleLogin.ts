import { useMutation } from '@tanstack/react-query';
import type { CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';

export const useGoogleLogin = () => {
  const { setAuth } = useAuthStore();

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
    },
  });

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    googleLoginMutation.mutate(credentialResponse);
  };

  return { handleGoogleLogin, isLoading: googleLoginMutation.isPending };
};

export default useGoogleLogin;
