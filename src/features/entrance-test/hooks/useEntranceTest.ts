import { useState, useEffect, useCallback } from 'react';
import type { EntranceTestQuestion, EntranceTestState, EntranceTestResult } from '../types/entrance-test.types';

const STORAGE_KEY = 'entrance-test-state';

export function useEntranceTest() {
  const [questions, setQuestions] = useState<EntranceTestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testState, setTestState] = useState<EntranceTestState>({
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false,
    progress: 0,
  });

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTestState(parsed);
      }
    } catch (e) {
      console.error('Failed to load saved test state:', e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
  }, [testState]);

  // Mock function to load questions - replace with actual API call later
  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock questions for now
      const mockQuestions: EntranceTestQuestion[] = [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary purpose of React?',
          options: ['To build user interfaces', 'To handle backend logic', 'To manage databases', 'To design graphics'],
          correctAnswer: 'To build user interfaces',
        },
        {
          id: 'q2',
          type: 'single-choice',
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 'useState',
        },
      ];
      setQuestions(mockQuestions);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const selectAnswer = useCallback((questionId: string, answer: any) => {
    setTestState((prev) => {
      const newAnswers = { ...prev.answers, [questionId]: answer };
      const progress = Object.keys(newAnswers).length / questions.length;
      return { ...prev, answers: newAnswers, progress };
    });
  }, [questions.length]);

  const nextQuestion = useCallback(() => {
    if (testState.currentQuestionIndex < questions.length - 1) {
      setTestState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  }, [testState.currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (testState.currentQuestionIndex > 0) {
      setTestState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  }, [testState.currentQuestionIndex]);

  const submitTest = useCallback(async (): Promise<EntranceTestResult> => {
    // Mock submission - replace with actual API call
    setTestState((prev) => ({ ...prev, isCompleted: true }));
    localStorage.removeItem(STORAGE_KEY);
    return { skipToMilestoneId: 'milestone_2' };
  }, []);

  const resetTest = useCallback(() => {
    setTestState({
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      progress: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    questions,
    isLoading,
    error,
    testState,
    currentQuestion: questions[testState.currentQuestionIndex],
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitTest,
    resetTest,
  };
}
