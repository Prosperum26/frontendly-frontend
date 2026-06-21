import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import { useToast } from '../components/Toast';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid token');
      return;
    }

    // Password validation (same as register)
    const isLengthValid = password.length >= 8 && password.length <= 32;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber) {
      setError('New password must be 8-32 characters and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword({ token, newPassword: password });
      setIsSubmitted(true);
      addToast('Password Reset Successful', 'Your password has been reset successfully. Please login with your new password.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'The password reset link is invalid or has expired. Please request a new link to continue.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-main-bg min-h-[70vh]">
        <div className="w-full max-w-md bg-main-bg rounded-2xl shadow-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-body mb-8">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Yêu cầu link mới</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-surface min-h-[70vh]">
      <div className="w-full max-w-md bg-main-bg rounded-2xl shadow-xl border border-border p-10">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold !text-heading">Đặt lại mật khẩu</h1>
              <p className="text-sm text-muted mt-2 px-4">Nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-body mb-2 uppercase tracking-wide">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-body mb-2 uppercase tracking-wide">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-surface"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-200">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h1 className="text-2xl font-bold !text-heading mb-3">Thành công!</h1>
            <p className="text-sm text-muted mb-8 px-2">
              Your password has been reset successfully. You will be redirected to the login page in a moment.
            </p>
            <Link to="/login" className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
