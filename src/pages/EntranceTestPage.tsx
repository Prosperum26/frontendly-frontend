import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { useEntranceTest } from '../features/entrance-test/hooks/useEntranceTest';
import { ROUTES } from '../constants/routes';
import './EntranceTestPage.css';

export const EntranceTestPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    questions,
    isLoading,
    error,
    testState,
    currentQuestion,
    lastResult,
    xpEarned,
    autoPassedCount,
    isSubmitting,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitTest,
    resetTest,
  } = useEntranceTest();

  const handleSubmit = async () => {
    try {
      await submitTest();
    } catch (err) {
      console.error('Failed to submit test:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="entrance-test-page">
        <div className="entrance-test-container">
          <Loader />
          <p className="entrance-test-subtitle mt-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entrance-test-page">
        <div className="entrance-test-container">
          <div className="mb-4 font-bold text-[var(--color-error)]">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (testState.isCompleted && lastResult) {
    const { personalizedPath, placementResult, score, totalQuestions } = lastResult;

    return (
      <div className="entrance-test-page">
        <div className="entrance-test-container">
          <h1 className="mb-4 text-3xl font-bold">Test Completed!</h1>
          <p className="entrance-test-subtitle mb-4">
            Score: {score}/{totalQuestions} — Level: {placementResult?.level ?? 'N/A'}
          </p>

          {(autoPassedCount > 0 || xpEarned > 0) && (
            <div className="entrance-test-xp-summary mb-4">
              <p className="entrance-test-xp-line">
                Auto-passed lessons: <strong>{autoPassedCount}</strong>
              </p>
              <p className="entrance-test-xp-line">
                XP earned: <strong>+{xpEarned}</strong>
              </p>
            </div>
          )}

          {personalizedPath?.studyPlan && personalizedPath.studyPlan.length > 0 && (
            <div className="entrance-test-study-plan mb-6">
              <h2 className="mb-2 text-lg font-semibold">Your Study Plan</h2>
              <ul className="list-disc space-y-1 pl-5">
                {personalizedPath.studyPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {personalizedPath?.learningPath && (
            <div className="entrance-test-path-summary mb-6">
              <h2 className="mb-2 text-lg font-semibold">Lesson Overview</h2>
              <div className="grid gap-2">
                {personalizedPath.learningPath.map((lesson) => (
                  <div
                    key={lesson.canonicalLessonId}
                    className={`entrance-test-path-item ${
                      lesson.status === 'auto_passed'
                        ? 'is-auto-passed'
                        : lesson.status === 'locked'
                          ? 'is-locked'
                          : 'is-required'
                    }`}
                  >
                    <span>{lesson.title}</span>
                    <span className="font-medium capitalize">
                      {lesson.status === 'auto_passed' && '✓ Auto-passed'}
                      {lesson.status === 'required' && '▶ Required'}
                      {lesson.status === 'locked' && '🔒 Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => navigate(ROUTES.LEARNING_PATH)}>Go to Learning Path</Button>
          <Button variant="secondary" className="mt-4" onClick={resetTest}>
            Retake Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="entrance-test-page">
      <div className="entrance-test-container">
        <div className="mb-8">
          <h1 className="mb-4 text-2xl font-bold">Entrance Test</h1>
          <ProgressBar value={testState.progress * 100} />
          <div className="entrance-test-subtitle mt-2 text-sm">
            Question {testState.currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {currentQuestion && (
          <div className="mb-8">
            <h2 className="mb-6 text-xl font-semibold">{currentQuestion.question}</h2>

            {(currentQuestion.type === 'multiple-choice' ||
              currentQuestion.type === 'single-choice') &&
              currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`entrance-test-option ${
                        testState.answers[currentQuestion.id] === option ? 'is-selected' : ''
                      }`}
                      onClick={() => selectAnswer(currentQuestion.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={previousQuestion}
            disabled={testState.currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {testState.currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={nextQuestion} disabled={!testState.answers[currentQuestion?.id]}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!testState.answers[currentQuestion?.id] || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntranceTestPage;
