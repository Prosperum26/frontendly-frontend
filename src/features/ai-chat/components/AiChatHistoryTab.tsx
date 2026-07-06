import { useEffect, useState } from 'react';
import { useChatHistory } from '../hooks/useChatHistory';
import { ChatHistoryList } from './ChatHistoryList';
import { ChatHistoryDetail } from './ChatHistoryDetail';
import { Loader2 } from 'lucide-react';

export function AiChatHistoryTab() {
  const { sessions, currentSession, isLoading, error, fetchSessions, fetchSessionMessages, setCurrentSession } =
    useChatHistory();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSelectSession = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    await fetchSessionMessages(sessionId);
  };

  const handleBack = () => {
    setSelectedSessionId(undefined);
    setCurrentSession(null);
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      {selectedSessionId ? (
        <ChatHistoryDetail
          sessionData={currentSession}
          onBack={handleBack}
          isLoading={isLoading}
        />
      ) : (
        <ChatHistoryList
          sessions={sessions}
          onSelectSession={handleSelectSession}
          selectedSessionId={selectedSessionId}
        />
      )}
    </div>
  );
}
