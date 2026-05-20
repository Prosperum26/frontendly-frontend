import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  // THÊM: Trạng thái kiểm tra đã gửi email thành công chưa
  const [isSubmitted, setIsSubmitted] = useState(false);
  // THÊM: Trạng thái loading chờ gọi API
  const [isLoading, setIsLoading] = useState(false);

  // CHUẨN BỊ CHO BACKEND: Đổi thành async function với try/catch
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Gọi API gửi email ở đây sau này
      // ví dụ: await api.sendResetPasswordLink({ email });

      // Giả lập mạng chậm 1 giây (bạn có thể xóa sau khi có API thật)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gọi API thành công -> chuyển sang giao diện thông báo
      setIsSubmitted(true);
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      // Xử lý báo lỗi ở đây (nếu có)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 p-10">
        
        {/* ĐIỀU KIỆN CHUYỂN ĐỔI UI */}
        {!isSubmitted ? (
          <>
            {/* GIAO DIỆN CŨ: FORM NHẬP EMAIL */}
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold !text-slate-900">Quên mật khẩu</h1>
              <p className="text-sm text-slate-500 mt-2 px-4">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z" fill="#737686"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    disabled={isLoading}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline flex items-center justify-center">
                <span className="mr-2">←</span> Quay lại Đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* GIAO DIỆN MỚI: THÔNG BÁO THÀNH CÔNG */}
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-200">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              
              <h1 className="text-2xl font-bold !text-slate-900 mb-3">Chúng tôi đã gửi email đặt lại mật khẩu</h1>
              <p className="text-sm text-slate-500 mb-8 px-2">
                Vui lòng kiểm tra hộp thư đến của bạn. Chúng tôi đã gửi một liên kết an toàn để đặt lại mật khẩu của bạn.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg py-3.5 mb-8 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Link có hiệu lực trong 15 phút
              </div>

              <Link to="/login" className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6 shadow-lg shadow-blue-200">
                Quay lại Đăng nhập
              </Link>

              <p className="text-sm text-slate-500">
                Bạn không nhận được email?{' '}
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Gửi lại yêu cầu
                </button>
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* Ẩn link Đăng ký nếu đang ở màn hình Thành công */}
      {!isSubmitted && (
        <p className="mt-8 text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-bold text-blue-600 hover:underline">Sign up</Link>
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordPage;