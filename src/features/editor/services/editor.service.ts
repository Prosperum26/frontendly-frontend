import api from '../../../services/api';
import type {
  EvaluationResult,
  WorkspaceFiles,
  ExerciseDefinition,
  ExerciseRequirement,
  BackendExerciseResponse,
  BackendSubmitResponse,
  BackendRequirementResult,
  LintEvaluationResult,
  VisualEvaluationResult,
} from '../types/editor.types';

function getResponseData<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const editorService = {
  async getExercise(exerciseId: string, userId: string): Promise<ExerciseDefinition> {
    const response = await api.get<{ success: boolean; data: BackendExerciseResponse }>(
      `/exercises/${exerciseId}/${userId}`
    );
    const data = getResponseData(response.data);
    const targetDesigns = data.target_designs ?? (data.target_design ? [data.target_design] : []);

    return {
      id: data.id,
      practiceLabel: data.module,
      title: data.title,
      level: data.level || 'easy',
      description: data.description,
      objective: data.title,
      estimatedTime: '20 min',
      topicTags: [data.module.split(':')[0]],
      targetImageUrl: targetDesigns[0]?.url ?? '',
      targetDesigns,
      evaluationConfig: data.evaluation_config,
      restrictions: data.restrictions ?? [],
      requirements: (data.requirements || []).map((req) => ({
        id: req.id,
        label: req.text,
        done: false,
      })),
      navigation: data.navigation
        ? {
            prev: data.navigation.prev,
            next: data.navigation.next,
            currentMilestoneId: data.navigation.currentMilestoneId,
          }
        : undefined,
      starterFiles: {
        html: data.html_content || '',
        css: data.css_content || '',
        js: data.js_content || '',
        jsx: data.jsx_content || '',
      },
    };
  },

  async submitWorkspace(
    exerciseId: string,
    userId: string,
    files: WorkspaceFiles,
    requirements: ExerciseRequirement[]
  ): Promise<EvaluationResult> {
    const response = await api.post<{ success: boolean; data: BackendSubmitResponse }>(
      `/exercises/${exerciseId}/${userId}/submit`,
      {
        editorContent: {
          html: files.html,
          css: files.css,
          js: files.js,
          jsx: files.jsx || '',
        },
      }
    );
    const data = getResponseData(response.data);

    const lint = data.lint_errors;
    const hasLintErrors =
      (lint?.html_err?.length ?? 0) > 0 ||
      (lint?.css_err?.length ?? 0) > 0 ||
      (lint?.js_err?.length ?? 0) > 0 ||
      (lint?.jsx_err?.length ?? 0) > 0;

    let output = '';
    if (hasLintErrors && lint) {
      output += 'Lint errors:\n';
      lint.html_err?.forEach((err) => {
        output += `[HTML] Line ${err.line}: ${err.message}\n`;
      });
      lint.css_err?.forEach((err) => {
        output += `[CSS] Line ${err.line}: ${err.message}\n`;
      });
      lint.js_err?.forEach((err) => {
        output += `[JS] Line ${err.line}: ${err.message}\n`;
      });
      lint.jsx_err?.forEach((err) => {
        output += `[JSX] Line ${err.line}: ${err.message}\n`;
      });
      output += '\nFix all lint errors before continuing.';
    } else {
      const evaluationResults = data.requirementResult || data.evaluationResults || [];
      const passedCount = evaluationResults.filter((result) => result.passed).length;
      const totalCount = evaluationResults.length;
      output = `Evaluation result: ${passedCount}/${totalCount} requirements passed (${data.match_percentage ?? 0}%).\n`;
      output += data.isCompleted
        ? 'Great work. Your solution meets all requirements.'
        : 'Some requirements are still failing. Review the checklist and try again.';

      if (data.behavior_results && data.behavior_results.totalTests > 0) {
        output += `\nBehavior tests: ${data.behavior_results.passedTests}/${data.behavior_results.totalTests} passed.`;
      }
      if (data.behavior_results?.errors) {
        output += `\n${data.behavior_results.errors}`;
      }
    }

    const evaluationResults = data.requirementResult || data.evaluationResults || [];
    const criteria = requirements.map((req) => {
      const res = evaluationResults.find(
        (result: BackendRequirementResult) => result.requirementId === req.id
      );
      return {
        id: req.id,
        label: req.label,
        passed: res ? res.passed : false,
      };
    });

    const lintResult: LintEvaluationResult | undefined = lint
      ? {
          html: lint.html_err || [],
          css: lint.css_err || [],
          js: lint.js_err || [],
          jsx: lint.jsx_err || [],
        }
      : undefined;

    const visualResult: VisualEvaluationResult[] | undefined = data.visual_results;

    return {
      passed: data.isCompleted,
      output,
      executionTime: 180,
      criteria,
      lint: lintResult,
      visual: visualResult,
      matchPercentage: data.match_percentage,
    };
  },

  async submitCode(code: string, language: string): Promise<EvaluationResult> {
    const response = await api.post<EvaluationResult>('/editor/submit', {
      code,
      language,
    });
    return response.data;
  },

  async getEvaluation(submissionId: string): Promise<EvaluationResult> {
    const response = await api.get<EvaluationResult>(`/editor/evaluation/${submissionId}`);
    return response.data;
  },
};

export default editorService;
