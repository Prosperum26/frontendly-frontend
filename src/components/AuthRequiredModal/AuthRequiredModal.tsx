import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, TriangleAlert } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/auth.store';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ 
  isOpen, 
  onClose, 
  redirectPath = ROUTES.ENTRANCE_TEST 
}) => {
  const navigate = useNavigate();
  const setPreviousRoute = useAuthStore((state) => state.setPreviousRoute);

  const handleLogin = () => {
    setPreviousRoute(redirectPath);
    onClose();
    navigate(ROUTES.LOGIN);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl p-8 max-w-[400px] w-[90%] text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 bg-none border-none cursor-pointer text-slate-500 p-1"
        >
          <X size={20} />
        </button>
        <div className="mb-3 flex justify-center">
          <TriangleAlert size={48} className="text-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Login Required
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          You must be logged in to take the entrance test
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="px-5 py-2.5 rounded-lg border-none bg-blue-600 text-white cursor-pointer text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <LogIn size={16} /> Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
