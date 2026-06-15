import React, { useState } from 'react';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth.types';
import Notification from '../../../components/Notification/Notification';

export const LoginForm: React.FC = () => {
  const { login, loading, notification, setNotification } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
