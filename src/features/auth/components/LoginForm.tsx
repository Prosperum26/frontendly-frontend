import React, { useState } from 'react';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth.types';

export const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <Input
        label="Email"
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        required
      />
      <Input
        label="Password"
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        required
      />
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="rememberMe"
          checked={credentials.rememberMe}
          onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="rememberMe" className="text-sm text-gray-700">
          Remember me
        </label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
