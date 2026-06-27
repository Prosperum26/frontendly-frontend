import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, ClipboardCheck } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface EntranceTestChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EntranceTestChoiceModal: React.FC<EntranceTestChoiceModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    onClose();
    navigate(ROUTES.ENTRANCE_TEST);
  };

  const handleStartLearning = () => {
    onClose();
    navigate(ROUTES.LEARNING_PATH);
  };

  const handleCancel = () => {
    onClose();
    navigate(ROUTES.HOME);
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
        className="relative bg-white rounded-xl p-8 max-w-[500px] w-[90%] text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 bg-none border-none cursor-pointer text-slate-500 p-1"
        >
          <X size={20} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Welcome to FrontEndly! 🎉
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Choose how you'd like to start your learning journey
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleStartTest}
            className="w-full px-6 py-4 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-700 cursor-pointer text-sm font-semibold flex items-center gap-3 hover:bg-blue-100 transition-colors"
          >
            <ClipboardCheck size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-bold">Take Entrance Test</div>
              <div className="text-xs text-slate-500 mt-1">Assess your level and skip lessons you already know</div>
            </div>
          </button>

          <button
            onClick={handleStartLearning}
            className="w-full px-6 py-4 rounded-lg border-2 border-green-600 bg-green-50 text-green-700 cursor-pointer text-sm font-semibold flex items-center gap-3 hover:bg-green-100 transition-colors"
          >
            <BookOpen size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-bold">Start Learning from Beginning</div>
              <div className="text-xs text-slate-500 mt-1">Begin with the fundamentals and progress step by step</div>
            </div>
          </button>
        </div>

        <button
          onClick={handleCancel}
          className="w-full px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EntranceTestChoiceModal;
