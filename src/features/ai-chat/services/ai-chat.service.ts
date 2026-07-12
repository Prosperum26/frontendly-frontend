import api from '../../../services/api';

import type {
  ChatRequest,
  ChatResponse,
  ChatHistoryResponse,
  QuotaResponse,
} from '../types/ai-chat.types';

const AI_CHAT_TIMEOUT = 60000; // 60 seconds for AI responses
const MAX_RETRIES = 2;

export const aiChatService = {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await api.post('/ai-chat/chat', request, {
          timeout: AI_CHAT_TIMEOUT,
        });
        return response.data.data;
      } catch (error: unknown) {
        lastError = error as Error;

        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

        // Don't retry on client errors (4xx) except 408 Request Timeout
        if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500 && axiosError.response.status !== 408) {
          throw error;
        }

        // Don't retry on quota exceeded
        if (axiosError.response?.data?.message?.includes('quota')) {
          throw error;
        }

        if (attempt < MAX_RETRIES) {
          console.warn(`AI chat attempt ${attempt + 1} failed, retrying...`, error);
          // Exponential backoff: 1s, 2s
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('AI chat failed after retries');
  },

  async getSessions(): Promise<ChatHistoryResponse> {
    const response = await api.get('/ai-chat/sessions');
    return response.data.data;
  },

  async getSessionMessages(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await api.get(
      `/ai-chat/sessions/${sessionId}/messages`,
    );
    return response.data.data;
  },

  async createSession(): Promise<{ sessionId: string }> {
    const response = await api.post('/ai-chat/sessions');
    return response.data.data;
  },

  async getQuota(): Promise<QuotaResponse> {
    const response = await api.get('/ai-chat/quota');
    return response.data.data;
  },
};
