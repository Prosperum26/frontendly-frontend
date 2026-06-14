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

export const editorService = {
  async getExercise(exerciseId: string, userId: string): Promise<ExerciseDefinition> {
    const response = await api.get<{ success: boolean; data: BackendExerciseResponse }>(`/exercises/${exerciseId}/${userId}`);
    const data = response.data.data;

    return {
      id: data.id,
      practiceLabel: data.module,
      title: data.title,
      level: data.level || 'easy',
      description: data.description,
      objective: data.title,
      estimatedTime: '20 min',
      topicTags: [data.module.split(':')[0]],
      targetImageUrl: data.target_designs && data.target_designs.length > 0 ? data.target_designs[0].url : '',
      targetDesigns: data.target_designs,
      evaluationConfig: data.evaluation_config,
      requirements: (data.requirements || []).map((req) => ({
        id: req.id,
        label: req.text,
        done: false,
      })),
      navigation: data.navigation
        ? {
            prev: data.navigation.prev,
            next: data.navigation.next,
            currentMilestoneId: data.navigation.currentMilestoneId
          }
        : undefined,
      starterFiles: {
        html: data.html_content || '',
        css: data.css_content || '',
        js: data.js_content || '',
      },
    };
  },

  async submitWorkspace(
    exerciseId: string,
    userId: string,
    files: WorkspaceFiles,
    requirements: ExerciseRequirement[]
  ): Promise<EvaluationResult> {
    const response = await api.post<{ success: boolean; data: BackendSubmitResponse }>(`/exercises/${exerciseId}/${userId}/submit`, {
      editorContent: {
        html: files.html,
        css: files.css,
        js: files.js,
      },
    });
    const data = response.data.data;

    // Check lint errors
    const lint = data.lint_errors;
    const hasLintErrors =
      (lint?.html_err?.length ?? 0) > 0 ||
      (lint?.css_err?.length ?? 0) > 0 ||
      (lint?.js_err?.length ?? 0) > 0;

    let output = '';
    if (hasLintErrors && lint) {
      output += '⚠️ LỖI CÚ PHÁP (Lint ERRORS):\n';
      lint.html_err?.forEach((err) => {
        output += `[HTML] Dòng ${err.line}: ${err.message}\n`;
      });
      lint.css_err?.forEach((err) => {
        output += `[CSS] Dòng ${err.line}: ${err.message}\n`;
      });
      lint.js_err?.forEach((err) => {
        output += `[JS] Dòng ${err.line}: ${err.message}\n`;
      });
      output += '\nVui lòng sửa tất cả lỗi cú pháp trước khi tiếp tục.';
    } else {
      const evaluationResults = data.requirementResult || data.evaluationResults || [];
      const passedCount = evaluationResults.filter((r) => r.passed).length;
      const totalCount = evaluationResults.length;
      output = `Kết quả chấm điểm: Đạt ${passedCount}/${totalCount} yêu cầu (${data.match_percentage}%).\n`;
      if (data.isCompleted) {
        output += '🎉 Chúc mừng! Bạn đã hoàn thành xuất sắc tất cả yêu cầu bài tập!';
      } else {
        output += '❌ Một số yêu cầu chưa đạt. Hãy kiểm tra danh sách yêu cầu bên trái và thử lại.';
      }
    }

    // Map evaluationResults to criteria
    const evaluationResults = data.requirementResult || data.evaluationResults || [];
    const criteria = requirements.map((req) => {
      const res = evaluationResults.find((r: BackendRequirementResult) => r.requirementId === req.id);
      return {
        id: req.id,
        label: req.label,
        passed: res ? res.passed : false,
      };
    });

    // Map lint errors
    const lintResult: LintEvaluationResult | undefined = lint
      ? {
          html: lint.html_err || [],
          css: lint.css_err || [],
          js: lint.js_err || [],
        }
      : undefined;

    // Map visual results
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
