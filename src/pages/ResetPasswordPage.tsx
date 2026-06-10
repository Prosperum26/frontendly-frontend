import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!token) {
      setError('Token không hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword({ token, newPassword: password });
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-slate-600 mb-8">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Yêu cầu link mới</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 p-10">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold !text-slate-900">Đặt lại mật khẩu</h1>
              <p className="text-sm text-slate-500 mt-2 px-4">Nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-200">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h1 className="text-2xl font-bold !text-slate-900 mb-3">Thành công!</h1>
            <p className="text-sm text-slate-500 mb-8 px-2">
              Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng tới trang đăng nhập trong giây lát.
            </p>
            <Link to="/login" className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
