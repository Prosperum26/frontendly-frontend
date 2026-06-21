import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { EvaluationCriterion, ExerciseDefinition } from '../../features/editor/types/editor.types';
import { editorService } from '../../features/editor/services/editor.service';

export interface WorkspaceExerciseSectionProps {
  exercise: ExerciseDefinition;
  criteria?: EvaluationCriterion[];
}

function TargetDesignPreview({
  imageUrl,
  isLoading,
  hasError,
  width,
  height,
}: {
  imageUrl?: string | null;
  isLoading: boolean;
  hasError: boolean;
  width?: number;
  height?: number;
}) {
  if (isLoading) {
    return (
      <div className="workspace-target__loading" aria-busy="true" aria-label="Loading target design">
        <div className="workspace-target__loading-spinner" />
        <span>Rendering reference design…</span>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return (
      <div className="workspace-target__placeholder" role="img" aria-label="Target design unavailable">
        <div className="workspace-target__placeholder-bar" />
        <div className="workspace-target__placeholder-cell" />
        <div className="workspace-target__placeholder-cell" />
        <p className="workspace-target__placeholder-note">Reference preview unavailable</p>
      </div>
    );
  }

  return (
    <img
      className="workspace-target__image"
      src={imageUrl}
      alt="Target design — match your output to this layout"
      width={width}
      height={height}
    />
  );
}

export const WorkspaceExerciseSection: React.FC<WorkspaceExerciseSectionProps> = ({
  exercise,
  criteria,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [targetExpanded, setTargetExpanded] = useState(false);

  const {
    data: targetPreviewUrl,
    isLoading: targetLoading,
    isError: targetError,
  } = useQuery({
    queryKey: ['target-preview', exercise.id],
    queryFn: () => editorService.fetchTargetPreview(exercise.id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const targetImageUrl = targetPreviewUrl ?? exercise.targetImageUrl;
  const targetDesign = exercise.targetDesigns?.[0];

  const evaluatedRequirements = useMemo(() => {
    if (!criteria) return exercise.requirements;

    return exercise.requirements.map((requirement) => {
      const result = criteria.find((criterion) => criterion.id === requirement.id);
      return result ? { ...requirement, done: result.passed } : requirement;
    });
  }, [criteria, exercise.requirements]);

  const targetPreview = (
    <TargetDesignPreview
      imageUrl={targetImageUrl}
      isLoading={targetLoading}
      hasError={targetError}
      width={targetDesign?.width}
      height={targetDesign?.height}
    />
  );

  return (
    <section className="workspace-exercise" aria-labelledby="workspace-exercise-title">
      <div
        className={
          expanded
            ? 'workspace-exercise-panel'
            : 'workspace-exercise-panel workspace-exercise-panel--collapsed'
        }
      >
        <div className="workspace-exercise-panel__header">
          <div className="workspace-exercise-panel__summary">
            <span className="workspace-exercise-panel__summary-badge">
              <span className="workspace-exercise__badge-icon" aria-hidden />
              {exercise.practiceLabel}
            </span>
            <h2 id="workspace-exercise-title" className="workspace-exercise-panel__summary-title">
              {exercise.title}
            </h2>
          </div>
          <button
            type="button"
            className="workspace-exercise-panel__toggle"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="workspace-exercise-panel-body"
          >
            <span className="workspace-exercise-panel__toggle-label">
              {expanded ? 'Collapse' : 'Expand'}
            </span>
            <svg
              className="workspace-exercise-panel__toggle-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 10L8 6L12 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div id="workspace-exercise-panel-body" className="workspace-exercise-panel__body">
          <div className="workspace-exercise__grid">
            <div className="workspace-exercise__intro">
              <p className="workspace-exercise__desc">{exercise.description}</p>
              <div className="workspace-exercise__meta" aria-label="Exercise metadata">
                {exercise.estimatedTime && (
                  <span className="workspace-exercise__meta-pill">{exercise.estimatedTime}</span>
                )}
                {exercise.topicTags?.map((tag) => (
                  <span key={tag} className="workspace-exercise__meta-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="workspace-requirements">
              <h3 className="workspace-requirements__title">Requirements</h3>
              <ul className="workspace-requirements__list">
                {evaluatedRequirements.map((item) => (
                  <li key={item.id} className="workspace-requirements__item">
                    <span
                      className={
                        item.done
                          ? 'workspace-requirements__check workspace-requirements__check--done'
                          : 'workspace-requirements__check'
                      }
                      aria-hidden
                    >
                      {item.done && (
                        <svg viewBox="0 0 20 20" fill="none">
                          <path
                            d="M5 10l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="workspace-target">
              <div className="workspace-target__head">
                <span className="workspace-target__label">TARGET DESIGN</span>
                <button
                  type="button"
                  className="workspace-target__expand"
                  aria-label="Open target design preview"
                  onClick={() => setTargetExpanded(true)}
                  disabled={targetLoading}
                >
                  <span aria-hidden />
                </button>
              </div>
              <p className="workspace-target__hint">
                Match your live preview to this reference layout.
              </p>
              <div className="workspace-target__image-wrap">{targetPreview}</div>
            </aside>
          </div>
        </div>
      </div>

      {targetExpanded && (
        <div
          className="workspace-target-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Target design preview"
        >
          <button
            type="button"
            className="workspace-target-modal__backdrop"
            aria-label="Close target design preview"
            onClick={() => setTargetExpanded(false)}
          />
          <div className="workspace-target-modal__panel">
            <div className="workspace-target-modal__header">
              <span>Target design</span>
              <button
                type="button"
                className="workspace-target-modal__close"
                aria-label="Close target design preview"
                onClick={() => setTargetExpanded(false)}
              >
                x
              </button>
            </div>
            <div className="workspace-target-modal__body">{targetPreview}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkspaceExerciseSection;
