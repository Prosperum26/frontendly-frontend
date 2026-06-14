import { useEffect } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';

export const useSessionVerification = () => {
  const { isAuthenticated, setAuth, setAuthChecking, logout } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        // Verify session by calling profile API
        const user = await authService.getProfile();
        setAuth(true, user);
      } catch {
        // Session is invalid or expired
        logout();
      } finally {
        setAuthChecking(false);
      }
    };

    verifySession();
  }, [setAuth, setAuthChecking, logout]);

  return { isAuthenticated };
};

export default useSessionVerification;
