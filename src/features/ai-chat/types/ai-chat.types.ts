export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  exercise_id: string;
  created_at: Date;
}

export interface ChatSession {
  _id: string;
  exercise_ids: string[];
  message_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ChatRequest {
  exerciseId: string;
  userCode: string;
  message: string;
  sessionId?: string;
  exerciseTitle?: string;
  exerciseDescription?: string;
  codeTest?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  remainingQuota: number;
}

export interface QuotaResponse {
  remainingQuota: number;
  dailyLimit: number;
  resetAt: Date;
}

export interface ChatHistoryResponse {
  sessions: ChatSession[];
  messages?: ChatMessage[];
}
