import { Calendar, MessageSquare, Clock } from 'lucide-react';
import type { ChatSession } from '../types/ai-chat.types';

interface ChatHistoryListProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  selectedSessionId?: string;
}

export function ChatHistoryList({ sessions, onSelectSession, selectedSessionId }: ChatHistoryListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">No chat history yet</p>
        <p className="text-xs mt-1">Start a conversation in the editor to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <button
          key={session._id}
          onClick={() => onSelectSession(session._id)}
          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
            selectedSessionId === session._id
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {session.message_count} messages
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(session.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(session.updated_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              {session.exercise_ids.length > 0 && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate">
                  Exercises: {session.exercise_ids.slice(0, 2).join(', ')}
                  {session.exercise_ids.length > 2 && ` +${session.exercise_ids.length - 2} more`}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
