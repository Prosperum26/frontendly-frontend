import { useState, useEffect, useCallback } from 'react';
import type { EntranceTestQuestion, EntranceTestState, EntranceTestResult } from '../types/entrance-test.types';
import entranceTestService from '../services/entrance-test.service';

const STORAGE_KEY = 'entrance-test-state';
const initialTestState: EntranceTestState = {
  currentQuestionIndex: 0,
  answers: {},
  isCompleted: false,
  progress: 0,
};

function getSavedTestState(): EntranceTestState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTestState;
  } catch (e) {
    console.error('Failed to load saved test state:', e);
    return initialTestState;
  }
}

export function useEntranceTest() {
  const [questions, setQuestions] = useState<EntranceTestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testState, setTestState] = useState<EntranceTestState>(getSavedTestState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
  }, [testState]);

  useEffect(() => {
    let isMounted = true;

    entranceTestService
      .getQuestions()
      .then((fetchedQuestions) => {
        if (isMounted) {
          setQuestions(fetchedQuestions);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError('Failed to load questions');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    setTestState(initialTestState);
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
