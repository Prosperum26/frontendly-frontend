import axios from 'axios';
import { useState } from 'react';
import { useAuth } from './useAuth';
import { LoginCredentials } from '../types/auth.types';

function loginErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === 'string') return m;
    }
  }
  return 'Login failed';
}

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
    } catch (err: unknown) {
      setError(loginErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};

export default useLogin;
