import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { GoogleButton } from '../features/auth/components/GoogleButton';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== 'developer@devedu.com' || password !== '12345678') {
      setIsError(true);
      return;
    }

    setIsError(false);
    setAuth(true, {
      id: crypto.randomUUID(),
      username: email.split('@')[0],
      email: email,
    });
    navigate('/profile', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative">

      {isError && !isOffline && (
        <div className="absolute top-20 right-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-sm flex items-start z-50">
          {/* CHÈN SVG BÁO LỖI Ở ĐÂY */}
          <div>
            <h3 className="font-bold text-sm">Lỗi xác thực</h3>
            <p className="text-xs mt-1">Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email hoặc mật khẩu.</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">
            FrontEndly
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="#" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Home</Link>
            <Link to="#" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">Learn</Link>
            <Link to="#" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">Challenge</Link>
            <Link to="#" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">About</Link>
          </div>
        </div>
        <div className="flex space-x-4">
          <Link to="/register" className="px-4 py-2 text-blue-600 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50">Đăng ký</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">Bắt đầu học</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">

        {isOffline ? (
          <NetworkErrorCard
            onRetry={() => window.location.reload()}
            onBack={() => navigate('/')}
          />
        ) : (
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold !text-slate-900">Welcome Back</h1>
              <p className="text-sm text-slate-500 mt-2">Access your technical curriculum and projects.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isError ? 'text-red-500' : 'text-slate-700'}`}>Email Address</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isError ? 'text-red-500' : 'text-slate-400'}`}>
                    {<svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.66667 13.3333C1.20833 13.3333 0.815972 13.1701 0.489583 12.8438C0.163194 12.5174 0 12.125 0 11.6667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H15C15.4583 0 15.8507 0.163194 16.1771 0.489583C16.5035 0.815972 16.6667 1.20833 16.6667 1.66667V11.6667C16.6667 12.125 16.5035 12.5174 16.1771 12.8438C15.8507 13.1701 15.4583 13.3333 15 13.3333H1.66667ZM8.33333 7.5L1.66667 3.33333V11.6667H15V3.33333L8.33333 7.5ZM8.33333 5.83333L15 1.66667H1.66667L8.33333 5.83333ZM1.66667 3.33333V1.66667V3.33333V11.6667V3.33333Z" fill="#737686" />
                    </svg>
                    }
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setIsError(false); }}
                    placeholder="developer@devedu.com"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 ${isError ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isError ? 'text-red-500' : 'text-slate-700'}`}>Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isError ? 'text-red-500' : 'text-slate-400'}`}>
                    {<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.66667 17.5C1.20833 17.5 0.815972 17.3368 0.489583 17.0104C0.163194 16.684 0 16.2917 0 15.8333V7.5C0 7.04167 0.163194 6.64931 0.489583 6.32292C0.815972 5.99653 1.20833 5.83333 1.66667 5.83333H2.5V4.16667C2.5 3.01389 2.90625 2.03125 3.71875 1.21875C4.53125 0.40625 5.51389 0 6.66667 0C7.81944 0 8.80208 0.40625 9.61458 1.21875C10.4271 2.03125 10.8333 3.01389 10.8333 4.16667V5.83333H11.6667C12.125 5.83333 12.5174 5.99653 12.8438 6.32292C13.1701 6.64931 13.3333 7.04167 13.3333 7.5V15.8333C13.3333 16.2917 13.1701 16.684 12.8438 17.0104C12.5174 17.3368 12.125 17.5 11.6667 17.5H1.66667ZM1.66667 15.8333H11.6667V7.5H1.66667V15.8333ZM6.66667 13.3333C7.125 13.3333 7.51736 13.1701 7.84375 12.8438C8.17014 12.5174 8.33333 12.125 8.33333 11.6667C8.33333 11.2083 8.17014 10.816 7.84375 10.4896C7.51736 10.1632 7.125 10 6.66667 10C6.20833 10 5.81597 10.1632 5.48958 10.4896C5.16319 10.816 5 11.2083 5 11.6667C5 12.125 5.16319 12.5174 5.48958 12.8438C5.81597 13.1701 6.20833 13.3333 6.66667 13.3333ZM4.16667 5.83333H9.16667V4.16667C9.16667 3.47222 8.92361 2.88194 8.4375 2.39583C7.95139 1.90972 7.36111 1.66667 6.66667 1.66667C5.97222 1.66667 5.38194 1.90972 4.89583 2.39583C4.40972 2.88194 4.16667 3.47222 4.16667 4.16667V5.83333ZM1.66667 15.8333V7.5V15.8333Z" fill="#737686" />
                    </svg>
                    }
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 ${isError ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input type="checkbox" id="remember" className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-900 font-semibold">
                  Ghi nhớ đăng nhập
                  <span className="block text-xs font-normal text-slate-500 italic">Trình duyệt có thể lưu mật khẩu để đăng nhập nhanh</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2">
                Sign In →
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between">
              <hr className="w-full border-slate-200" />
              <span className="px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">Or continue with</span>
              <hr className="w-full border-slate-200" />
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleButton />
            </div>
          </div>
        )}

        {!isOffline && (
          <p className="mt-8 text-sm text-slate-500 text-center">
            Don't have an account? <Link to="/register" className="font-bold text-blue-600 hover:underline">Sign up</Link>
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 max-w-sm">
            <h3 className="text-lg font-black text-slate-900 mb-2">FrontEndly</h3>
            <p className="text-sm font-semibold text-slate-600 mb-4">Keep going, you're doing great!</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              © 2024 FrontEndly. Built for developers by developers.<br />
              Empowering the next generation of engineers with precision-crafted curriculum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
