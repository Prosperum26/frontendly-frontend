import React from 'react';
import type {
  EvaluationResult,
  ExerciseDefinition,
} from '../types/editor.types';
import './editor-ui.css';

interface EvaluationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResult;
  exercise: ExerciseDefinition;
}

export const EvaluationResultModal: React.FC<EvaluationResultModalProps> = ({
  isOpen,
  onClose,
  evaluationResult,
  exercise,
}) => {
  if (!isOpen) return null;

  const { passed, lint, criteria, visual, matchPercentage } = evaluationResult;
  const { evaluationConfig } = exercise;

  const hasLintEnabled = evaluationConfig?.lint !== false;
  const hasRequirementsEnabled = evaluationConfig?.requirements !== false;
  const hasVisualEnabled = evaluationConfig?.visual === true;

  return (
    <div className="evaluation-modal-backdrop" onClick={onClose}>
      <div className="evaluation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="evaluation-modal__header">
          <h2 className="evaluation-modal__title">
            {passed ? '🎉 Chúc mừng! Hoàn thành bài tập' : '❌ Một số yêu cầu chưa đạt'}
          </h2>
          <button
            type="button"
            className="evaluation-modal__close"
            onClick={onClose}
            aria-label="Close results"
          >
            ×
          </button>
        </div>

        <div className="evaluation-modal__body">
          {/* Match Percentage */}
          <div className="evaluation-section">
            <h3 className="evaluation-section__title">Điểm số tổng hợp</h3>
            <div className="evaluation-score">
              <div
                className={`evaluation-score__circle ${
                  passed ? 'evaluation-score__circle--success' : 'evaluation-score__circle--warning'
                }`}
              >
                <span className="evaluation-score__value">
                  {matchPercentage !== undefined ? `${matchPercentage.toFixed(0)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Lint Check */}
          {hasLintEnabled && (
            <div className="evaluation-section">
              <h3 className="evaluation-section__title">
                <span
                  className={
                    (lint?.html_err?.length ?? 0) +
                      (lint?.css_err?.length ?? 0) +
                      (lint?.js_err?.length ?? 0) +
                      (lint?.jsx_err?.length ?? 0) ===
                    0
                      ? 'evaluation-status--success'
                      : 'evaluation-status--error'
                  }
                >
                  {(lint?.html_err?.length ?? 0) +
                    (lint?.css_err?.length ?? 0) +
                    (lint?.js_err?.length ?? 0) +
                    (lint?.jsx_err?.length ?? 0) ===
                  0
                    ? '✓'
                    : '✗'}
                </span>{' '}
                Kiểm tra cú pháp (Lint)
              </h3>
              {lint &&
                ((lint?.html_err?.length ?? 0) +
                  (lint?.css_err?.length ?? 0) +
                  (lint?.js_err?.length ?? 0) +
                  (lint?.jsx_err?.length ?? 0) >
                  0) && (
                  <div className="lint-errors">
                    {lint.html_err && lint.html_err.length > 0 && (
                      <div className="lint-errors__group">
                        <h4 className="lint-errors__group-title">HTML</h4>
                        <ul className="lint-errors__list">
                          {lint.html_err.map((err, i) => (
                            <li key={i} className="lint-errors__item">
                              <span className="lint-errors__line">Dòng {err.line}:</span>{' '}
                              {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lint.css_err && lint.css_err.length > 0 && (
                      <div className="lint-errors__group">
                        <h4 className="lint-errors__group-title">CSS</h4>
                        <ul className="lint-errors__list">
                          {lint.css_err.map((err, i) => (
                            <li key={i} className="lint-errors__item">
                              <span className="lint-errors__line">Dòng {err.line}:</span>{' '}
                              {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lint.js_err && lint.js_err.length > 0 && (
                      <div className="lint-errors__group">
                        <h4 className="lint-errors__group-title">JavaScript</h4>
                        <ul className="lint-errors__list">
                          {lint.js_err.map((err, i) => (
                            <li key={i} className="lint-errors__item">
                              <span className="lint-errors__line">Dòng {err.line}:</span>{' '}
                              {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lint.jsx_err && lint.jsx_err.length > 0 && (
                      <div className="lint-errors__group">
                        <h4 className="lint-errors__group-title">JSX</h4>
                        <ul className="lint-errors__list">
                          {lint.jsx_err.map((err, i) => (
                            <li key={i} className="lint-errors__item">
                              <span className="lint-errors__line">Dòng {err.line}:</span>{' '}
                              {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Requirements Check */}
          {hasRequirementsEnabled && criteria && criteria.length > 0 && (
            <div className="evaluation-section">
              <h3 className="evaluation-section__title">
                <span
                  className={
                    criteria.every((c) => c.passed)
                      ? 'evaluation-status--success'
                      : 'evaluation-status--warning'
                  }
                >
                  {criteria.every((c) => c.passed) ? '✓' : '✗'}
                </span>{' '}
                Yêu cầu bài tập
              </h3>
              <ul className="requirements-checklist">
                {criteria.map((criterion) => (
                  <li
                    key={criterion.id}
                    className={`requirements-checklist__item ${
                      criterion.passed
                        ? 'requirements-checklist__item--passed'
                        : 'requirements-checklist__item--failed'
                    }`}
                  >
                    <span className="requirements-checklist__icon">
                      {criterion.passed ? '✓' : '✗'}
                    </span>
                    <span className="requirements-checklist__label">
                      {criterion.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Check */}
          {hasVisualEnabled && visual && visual.length > 0 && (
            <div className="evaluation-section">
              <h3 className="evaluation-section__title">
                <span
                  className={
                    visual.every((v) => v.passed)
                      ? 'evaluation-status--success'
                      : 'evaluation-status--warning'
                  }
                >
                  {visual.every((v) => v.passed) ? '✓' : '✗'}
                </span>{' '}
                Kiểm tra thiết kế (Visual Regression)
              </h3>
              <div className="visual-results">
                {visual.map((vResult, i) => (
                  <div key={i} className="visual-result">
                    <div className="visual-result__header">
                      <h4 className="visual-result__device">
                        {vResult.deviceType}
                      </h4>
                      <span
                        className={`visual-result__score ${
                          vResult.passed ? 'visual-result__score--success' : ''
                        }`}
                      >
                        {vResult.matchPercentage.toFixed(0)}%
                      </span>
                      {vResult.level_of_complete && (
                        <span className="visual-result__level">
                          ({vResult.level_of_complete})
                        </span>
                      )}
                    </div>
                    {vResult.diffImageUrl && (
                      <div className="visual-result__diff">
                        <img src={vResult.diffImageUrl} alt="Difference preview" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="evaluation-modal__footer">
          <button type="button" className="evaluation-modal__button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>


    </div>
  );
};

export default EvaluationResultModal;
