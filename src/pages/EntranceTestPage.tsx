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
          <p className="text-slate-600 mt-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entrance-test-page">
        <div className="entrance-test-container">
          <div className="text-red-600 font-bold mb-4">{error}</div>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Test Completed!</h1>
          <p className="text-slate-600 mb-4">
            Score: {score}/{totalQuestions} — Level: {placementResult?.level ?? 'N/A'}
          </p>

          {personalizedPath?.studyPlan && personalizedPath.studyPlan.length > 0 && (
            <div className="entrance-test-study-plan mb-6">
              <h2 className="text-lg font-semibold mb-2">Your Study Plan</h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {personalizedPath.studyPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {personalizedPath?.learningPath && (
            <div className="entrance-test-path-summary mb-6">
              <h2 className="text-lg font-semibold mb-2">Lesson Overview</h2>
              <div className="grid gap-2">
                {personalizedPath.learningPath.map((lesson) => (
                  <div
                    key={lesson.canonicalLessonId}
                    className={`flex justify-between text-sm p-2 rounded border ${
                      lesson.status === 'auto_passed'
                        ? 'bg-green-50 border-green-200'
                        : lesson.status === 'locked'
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-blue-50 border-blue-200'
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
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Entrance Test</h1>
          <ProgressBar value={testState.progress * 100} />
          <div className="text-sm text-slate-500 mt-2">
            Question {testState.currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {currentQuestion && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              {currentQuestion.question}
            </h2>

            {(currentQuestion.type === 'multiple-choice' ||
              currentQuestion.type === 'single-choice') &&
              currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        testState.answers[currentQuestion.id] === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-400'
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
