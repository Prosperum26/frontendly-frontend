  import { X, Loader2 } from 'lucide-react';
  import { useEffect, useRef } from 'react';
  

  import { useAiChat } from '../hooks/useAiChat';
  import { ChatMessageComponent } from './ChatMessage';
  import { ChatInput } from './ChatInput';
  import { QuotaIndicator } from './QuotaIndicator';
  import type { ChatMessage } from '../types/ai-chat.types';

  interface AiChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId: string;
    userCode: string;
    exerciseTitle?: string;
    exerciseDescription?: string;
    codeTest?: string;
  }

  export function AiChatModal({
    isOpen,
    onClose,
    exerciseId,
    userCode,
    exerciseTitle,
    exerciseDescription,
    codeTest,
  }: AiChatModalProps) {
    const {
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
    } = useAiChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen) {
        fetchQuota();
      }
    }, [isOpen, fetchQuota]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (userMessage: string) => {
      if (!quota || quota.remainingQuota <= 0) {
        setError('Daily quota exceeded. Try again tomorrow.');
        return;
      }

      // Add user message to UI immediately
      const userMsg: ChatMessage = {
        _id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        exercise_id: exerciseId,
        created_at: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const aiResponse = await sendMessage({
          exerciseId,
          userCode,
          message: userMessage,
          sessionId,
          exerciseTitle,
          exerciseDescription,
          codeTest,
        });

        // Add AI response to UI
        const assistantMsg: ChatMessage = {
          _id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          exercise_id: exerciseId,
          created_at: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err : unknown) {
        console.log('Error sending message:', err);
        setMessages((prev) => prev.filter((msg) => msg._id !== userMsg._id));
      }
    };

    const handleNewSession = async () => {
      await createNewSession();
      setMessages([]);
    };

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-xl h-[85vh] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border-1 border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Tutor
            </h2>
            {quota && (
              <QuotaIndicator
                remainingQuota={quota.remainingQuota}
                dailyLimit={quota.dailyLimit}
                resetAt={quota.resetAt}
              />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <img 
                  src='/icon_no_background.png' 
                  className="w-13 h-13" 
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Need help with this exercise?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                I'm here to guide you through the solution without giving away the answer. Ask me anything!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessageComponent key={message._id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || (quota?.remainingQuota ?? 0) <= 0}
            placeholder={
              (quota?.remainingQuota ?? 0) <= 0
                ? 'Daily quota exceeded'
                : 'Ask for help...'
            }
          />
          {sessionId && messages.length > 0 && (
            <button
              onClick={handleNewSession}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Start new conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
  }
