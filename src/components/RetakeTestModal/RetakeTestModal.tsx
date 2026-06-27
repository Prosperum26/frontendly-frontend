import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface RetakeTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetakeTestModal: React.FC<RetakeTestModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate(ROUTES.ENTRANCE_TEST);
  };

  const handleCancel = () => {
    onClose();
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
        className="relative bg-white rounded-xl p-8 max-w-[450px] w-[90%] text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 bg-none border-none cursor-pointer text-slate-500 p-1"
        >
          <X size={20} />
        </button>
        
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={48} className="text-amber-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-3">
          Retake Entrance Test?
        </h2>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          It seems you have completed the entrance test before. Do you want to retake it?
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-700 text-xs font-semibold leading-relaxed">
            <strong>Warning:</strong> All your previous unlocks will be reset from the beginning.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="px-5 py-2.5 rounded-lg border-none bg-blue-600 text-white cursor-pointer text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetakeTestModal;
