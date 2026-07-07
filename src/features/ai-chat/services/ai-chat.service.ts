import api from '../../../services/api';

import type {
  ChatRequest,
  ChatResponse,
  ChatHistoryResponse,
  QuotaResponse,
} from '../types/ai-chat.types';

export const aiChatService = {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post('/ai-chat/chat', request);
    return response.data.data;
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
