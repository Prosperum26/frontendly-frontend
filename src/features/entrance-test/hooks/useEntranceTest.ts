import { useState, useEffect, useCallback } from 'react';
import type { EntranceTestQuestion, EntranceTestState, EntranceTestResult } from '../types/entrance-test.types';
import entranceTestService from '../services/entrance-test.service';

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

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await entranceTestService.getQuestions();
      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error(err);
      setError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const selectAnswer = useCallback((questionId: string, answer: unknown) => {
    setTestState((prev) => {
      const newAnswers = { ...prev.answers, [questionId]: answer };
      const progress = questions.length > 0 ? Object.keys(newAnswers).length / questions.length : 0;
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
    const result = await entranceTestService.submitTest(testState.answers);
    setTestState((prev) => ({ ...prev, isCompleted: true }));
    localStorage.removeItem(STORAGE_KEY);
    return result;
  }, [testState.answers]);

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
