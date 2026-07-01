import api from '../../../services/api';
import type {
  EvaluationResult,
  ExerciseDefinition,
  ExerciseRequirement,
  BackendExerciseResponse,
  BackendSubmitResponse,
  BackendRequirementResult,
  LintEvaluationResult,
  VisualEvaluationResult,
  TargetDesign,
  EditorFile,
} from '../types/editor.types';

function getResponseData<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const editorService = {
  async getExercise(exerciseId: string): Promise<ExerciseDefinition> {
    const response = await api.get<{ success: boolean; data: BackendExerciseResponse }>(
      `/exercises/${exerciseId}`
    );
    const data = getResponseData(response.data);

    const targetDesigns: TargetDesign[] = data.target_design ? [data.target_design] : [];

    // Use starter_files from the new multi-file schema
    const starterFiles: EditorFile[] = data.starter_files || [];

    // Fallback to deprecated fields if starter_files is empty
    if (starterFiles.length === 0) {
      const fallbackFiles: EditorFile[] = [];
      if (data.html_content) {
        fallbackFiles.push({ filename: 'index.html', language: 'html', content: data.html_content });
      }
      if (data.css_content) {
        fallbackFiles.push({ filename: 'index.css', language: 'css', content: data.css_content });
      }
      if (data.js_content) {
        fallbackFiles.push({ filename: 'index.js', language: 'js', content: data.js_content });
      }
      if (data.jsx_content) {
        fallbackFiles.push({ filename: 'App.jsx', language: 'jsx', content: data.jsx_content });
      }
      starterFiles.push(...fallbackFiles);
    }

    const editorFiles = starterFiles.map(f => f.filename);

    return {
      id: data.id,
      practiceLabel: data.module,
      title: data.title,
      level: data.level,
      description: data.description,
      estimatedTime: '20 min',
      topicTags: [data.module.split(':')[0], ...data.tags],
      targetImageUrl: data.target_url,
      targetDesigns,
      editorFiles,
      evaluationConfig: data.evaluation_config,
      requirements: data.requirements.map((req) => ({
        id: req.id,
        label: req.text,
        done: false,
      })),
      navigation: data.navigation
        ? {
            prev: data.navigation.prev
              ? { ...data.navigation.prev, milestoneId: undefined }
              : null,
            next: data.navigation.next
              ? { ...data.navigation.next, milestoneId: undefined }
              : null,
            currentMilestoneId: undefined,
          }
        : undefined,
      starterFiles,
    };
  },

  async submitWorkspace(
    exerciseId: string,
    files: EditorFile[],
    requirements: ExerciseRequirement[]
  ): Promise<EvaluationResult> {
    const response = await api.post<{ success: boolean; data: BackendSubmitResponse }>(
      `/exercises/${exerciseId}/submit`,
      {
        editorContent: {
          files: files,
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
      const evaluationResults = data.requirementResult;
      const passedCount = evaluationResults.filter((result) => result.passed).length;
      const totalCount = evaluationResults.length;
      output = `Evaluation result: ${passedCount}/${totalCount} requirements passed (${data.match_percentage}%).\n`;
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

    const evaluationResults = data.requirementResult;
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

    const lintResult: LintEvaluationResult | undefined = lint;
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
