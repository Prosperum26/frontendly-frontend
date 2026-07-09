import { useEffect } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';
import { profileService } from '../../profile/services/profile.service';

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
        
        // Also fetch profile data to get latest avatar
        try {
          const profile = await profileService.fetchProfile();
          // Merge profile data with user data, prioritizing profile avatar
          setAuth(true, { 
            ...user, 
            avatar: profile.avatar || profile.avatarUrl || user.avatar || user.avatarUrl,
            avatarUrl: profile.avatarUrl || profile.avatar || user.avatarUrl || user.avatar
          });
        } catch {
          // If profile fetch fails, use auth user data
          setAuth(true, user);
        }
      } catch {
        // Session is invalid or expired
        // Only logout if currently authenticated to prevent loop during login
        if (isAuthenticated) {
          logout();
        } else {
          setAuthChecking(false);
        }
      } finally {
        setAuthChecking(false);
      }
    };

    verifySession();
  }, [setAuth, setAuthChecking, logout]); // Remove isAuthenticated from dependencies to prevent re-run loops

  return { isAuthenticated };
};

export default useSessionVerification;
