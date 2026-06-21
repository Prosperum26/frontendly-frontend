import { useState, useEffect, useCallback } from 'react';
import type {
  EntranceTestQuestion,
  EntranceTestState,
  EntranceTestResult,
} from '../types/entrance-test.types';
import entranceTestService from '../services/entrance-test.service';
import { savePersonalizedPath } from '../utils/personalized-path.storage';
import { useAuthStore } from '../../../store/auth.store';
import { DEFAULT_SKILL_ID } from '../../learning-path/utils/roadmapMappers';

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
  } catch {
    return initialTestState;
  }
}

export function useEntranceTest() {
  const [questions, setQuestions] = useState<EntranceTestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testState, setTestState] = useState<EntranceTestState>(getSavedTestState);
  const [lastResult, setLastResult] = useState<EntranceTestResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .catch(() => {
        if (isMounted) {
          setError('Failed to load questions. Please try again later.');
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

  const selectAnswer = useCallback(
    (questionId: string, answer: unknown) => {
      setTestState((prev) => {
        const newAnswers = { ...prev.answers, [questionId]: answer };
        const progress =
          questions.length > 0 ? Object.keys(newAnswers).length / questions.length : 0;
        return { ...prev, answers: newAnswers, progress };
      });
    },
    [questions.length],
  );

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
    setIsSubmitting(true);
    try {
      const result = await entranceTestService.submitTest(testState.answers);
      setLastResult(result);
      setTestState((prev) => ({ ...prev, isCompleted: true }));
      localStorage.removeItem(STORAGE_KEY);

      savePersonalizedPath({
        skipToMilestoneId: result.skipToMilestoneId,
        skillId: result.skillId || DEFAULT_SKILL_ID,
        score: result.score,
        totalQuestions: result.totalQuestions,
        placementResult: result.placementResult,
        personalizedPath: result.personalizedPath,
        completedAt: Date.now(),
      });

      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && result.personalizedPath) {
        await entranceTestService.syncPlacementTest({
          skipToMilestoneId: result.skipToMilestoneId,
          skillId: result.skillId || DEFAULT_SKILL_ID,
          learningPath: result.personalizedPath.learningPath,
          studyPlan: result.personalizedPath.studyPlan,
        });
      }

      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, [testState.answers]);

  const resetTest = useCallback(() => {
    setTestState(initialTestState);
    setLastResult(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    questions,
    isLoading,
    error,
    testState,
    lastResult,
    isSubmitting,
    currentQuestion: questions[testState.currentQuestionIndex],
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitTest,
    resetTest,
  };
}

export default useEntranceTest;
