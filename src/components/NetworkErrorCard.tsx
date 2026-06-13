import React from 'react';

interface NetworkErrorCardProps {
  onRetry: () => void;
  onBack: () => void;
}

export const NetworkErrorCard: React.FC<NetworkErrorCardProps> = ({ onRetry, onBack }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 p-8 text-center mx-auto">
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-red-100/80 rounded-2xl flex items-center justify-center text-red-500 mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c3.66 0 6.98 1.4 9.5 3.71"></path>
          <path d="M14.43 9.4A5.96 5.96 0 0 1 18 11.5"></path>
          <path d="M17.5 16.51l.01.01"></path>
          <path d="M2 2l20 20"></path>
          <path d="M2.5 8.71c.7-.6 1.46-1.12 2.26-1.57"></path>
          <path d="M6.28 11.5c.34-.23.7-.44 1.07-.63"></path>
          <path d="M10.15 14.5c.27-.18.57-.33.88-.45"></path>
          <path d="M12 18.5l.01.01"></path>
        </svg>
      </div>

      <h2 className="text-2xl font-bold !text-slate-900 mb-3">Lỗi kết nối</h2>
      <p className="text-sm text-slate-500 mb-8 px-2 font-medium">
        Không thể gửi yêu cầu. Vui lòng kiểm tra lại đường truyền và thử lại.
      </p>

      {/* Buttons */}
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mb-3 shadow-md shadow-blue-600/20"
      >
        Thử lại
      </button>
      <button
        onClick={onBack}
        className="w-full bg-slate-200 text-slate-700 font-bold py-3.5 rounded-lg hover:bg-slate-300 transition-colors mb-6"
      >
        Quay lại
      </button>

      <hr className="w-full border-slate-100 mb-5" />

      {/* Hint */}
      <div className="flex items-start gap-2 text-left">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          Gợi ý: Hãy thử khởi động lại trình duyệt hoặc chuyển đổi giữa Wi-Fi và mạng di động.
        </p>
      </div>
    </div>
  );
};

export default NetworkErrorCard;