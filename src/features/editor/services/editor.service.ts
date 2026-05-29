import api from '../../../services/api';
import type {
  EvaluationResult,
  WorkspaceFiles,
  ExerciseDefinition,
  ExerciseRequirement,
} from '../types/editor.types';

export const editorService = {
  async getExercise(exerciseId: string, userId: string): Promise<ExerciseDefinition> {
    const response = await api.get<any>(`/exercises/${exerciseId}/${userId}`);
    const data = response.data;

    return {
      id: data.id,
      practiceLabel: data.module,
      title: data.title,
      level: data.id.includes('span') || data.id.includes('wrap') || data.id.includes('classlist') || data.id.includes('3') ? 'hard' : (data.id.includes('2') || data.id.includes('med') || data.id.includes('event') ? 'medium' : 'easy'),
      description: data.description,
      objective: data.title,
      estimatedTime: '20 min',
      topicTags: [data.module.split(':')[0]],
      targetImageUrl: data.target_design_url || '',
      requirements: (data.requirements || []).map((req: any) => ({
        id: req.id,
        label: req.text,
        done: false,
      })),
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
    const response = await api.post<any>(`/exercises/${exerciseId}/${userId}/submit`, {
      editorContent: {
        html: files.html,
        css: files.css,
        js: files.js,
      },
    });
    const data = response.data; // SubmitResponse

    // Check lint errors
    const lint = data.lint_errors;
    const hasLintErrors =
      (lint?.html_err?.length ?? 0) > 0 ||
      (lint?.css_err?.length ?? 0) > 0 ||
      (lint?.js_err?.length ?? 0) > 0;

    let output = '';
    if (hasLintErrors) {
      output += '⚠️ LỖI CÚ PHÁP (LINT ERRORS):\n';
      lint.html_err?.forEach((err: any) => {
        output += `[HTML] Dòng ${err.line}: ${err.message}\n`;
      });
      lint.css_err?.forEach((err: any) => {
        output += `[CSS] Dòng ${err.line}: ${err.message}\n`;
      });
      lint.js_err?.forEach((err: any) => {
        output += `[JS] Dòng ${err.line}: ${err.message}\n`;
      });
      output += '\nVui lòng sửa tất cả lỗi cú pháp trước khi tiếp tục.';
    } else {
      const passedCount = (data.evaluationResults || []).filter((r: any) => r.passed).length;
      const totalCount = (data.evaluationResults || []).length;
      output = `Kết quả chấm điểm: Đạt ${passedCount}/${totalCount} yêu cầu (${data.match_percentage}%).\n`;
      if (data.isCompleted) {
        output += '🎉 Chúc mừng! Bạn đã hoàn thành xuất sắc tất cả yêu cầu bài tập!';
      } else {
        output += '❌ Một số yêu cầu chưa đạt. Hãy kiểm tra danh sách yêu cầu bên trái và thử lại.';
      }
    }

    // Map evaluationResults to criteria
    const criteria = requirements.map((req) => {
      const res = (data.evaluationResults || []).find((r: any) => r.requirementId === req.id);
      return {
        id: req.id,
        label: req.label,
        passed: res ? res.passed : false,
      };
    });

    return {
      passed: data.isCompleted,
      output,
      executionTime: 180,
      criteria,
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
