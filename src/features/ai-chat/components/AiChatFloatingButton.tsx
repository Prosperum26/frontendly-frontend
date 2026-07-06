import { Bot } from 'lucide-react';
import { useState } from 'react';

interface AiChatFloatingButtonProps {
  onClick: () => void;
  remainingQuota?: number;
}

export function AiChatFloatingButton({ onClick, remainingQuota }: AiChatFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 group"
      aria-label="Open AI Chat"
    >
      <Bot className="w-6 h-6" />
      {remainingQuota !== undefined && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {remainingQuota}
        </span>
      )}
      {isHovered && (
        <div className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          AI Tutor
        </div>
      )}
    </button>
  );
}
