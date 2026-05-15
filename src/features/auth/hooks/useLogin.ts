import { useState } from 'react';
import { useAuth } from './useAuth';
import { LoginCredentials } from '../types/auth.types';

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};

export default useLogin;
