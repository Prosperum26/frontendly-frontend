import { ArrowLeft, Loader2 } from 'lucide-react';
import { ChatMessageComponent } from './ChatMessage';
import type { ChatHistoryResponse } from '../types/ai-chat.types';

interface ChatHistoryDetailProps {
  sessionData: ChatHistoryResponse | null;
  onBack: () => void;
  isLoading: boolean;
}

export function ChatHistoryDetail({ sessionData, onBack, isLoading }: ChatHistoryDetailProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!sessionData || !sessionData.messages || sessionData.messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No messages in this session</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Conversation
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {sessionData.messages.length} messages
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {sessionData.messages.map((message) => (
          <ChatMessageComponent key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
}
