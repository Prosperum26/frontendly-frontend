import { useState, useCallback } from 'react';
import { aiChatService } from '../services/ai-chat.service';
import type { ChatSession, ChatHistoryResponse } from '../types/ai-chat.types';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiChatService.getSessions();
      setSessions(response.sessions);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (err as { message?: string }).message || 'Failed to fetch sessions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSessionMessages = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiChatService.getSessionMessages(sessionId);
      setCurrentSession(response);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (err as { message?: string }).message || 'Failed to fetch messages';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sessions,
    currentSession,
    isLoading,
    error,
    fetchSessions,
    fetchSessionMessages,
    setCurrentSession,
  };
}
