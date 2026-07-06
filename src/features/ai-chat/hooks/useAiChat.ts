import { useState, useCallback } from 'react';
import { aiChatService } from '../services/ai-chat.service';
import type { ChatMessage, ChatRequest, ChatResponse, QuotaResponse } from '../types/ai-chat.types';

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = useCallback(async () => {
    try {
      const quotaData = await aiChatService.getQuota();
      setQuota(quotaData);
    } catch (err) {
      console.error('Failed to fetch quota:', err);
    }
  }, []);

  const sendMessage = useCallback(
    async (request: ChatRequest) => {
      setError(null);
      setIsLoading(true);

      try {
        const response: ChatResponse = await aiChatService.chat({
          ...request,
          sessionId,
        });

        setSessionId(response.sessionId);
        setQuota((prev) => ({
          ...prev!,
          remainingQuota: response.remainingQuota,
        }));

        return response.message;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId],
  );

  const createNewSession = useCallback(async () => {
    try {
      const { sessionId: newSessionId } = await aiChatService.createSession();
      setSessionId(newSessionId);
      setMessages([]);
      return newSessionId;
    } catch (err) {
      console.error('Failed to create session:', err);
      throw err;
    }
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    sessionId,
    quota,
    error,
    setError,
    sendMessage,
    createNewSession,
    fetchQuota,
  };
}
