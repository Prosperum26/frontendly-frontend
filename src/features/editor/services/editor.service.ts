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
    let starterFiles: EditorFile[] = data.starter_files || [];

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
      starterFiles = [...starterFiles, ...fallbackFiles];
    }

    // For exercises with JSX but no HTML/CSS, add default HTML/CSS for live preview
    const hasJsx = starterFiles.some(f => f.language === 'jsx');
    const hasHtml = starterFiles.some(f => f.language === 'html');
    const hasCss = starterFiles.some(f => f.language === 'css');
    
    if (hasJsx && !hasHtml) {
      starterFiles = [{ 
        filename: 'index.html', 
        language: 'html', 
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>' 
      }, ...starterFiles];
    }
    
    if (hasJsx && !hasCss) {
      const cssFile: EditorFile = { 
        filename: 'index.css', 
        language: 'css', 
        content: 'body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: radial-gradient(circle at top, #1e293b, #0f172a); font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; }\n.root-card { background: rgba(255, 255, 255, 0.03); padding: 50px 70px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); text-align: center; }\nh1 { color: #61dafb; font-size: 38px; margin: 0 0 16px 0; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 0 20px rgba(97, 218, 251, 0.3); }\np { color: #94a3b8; font-size: 20px; margin: 0; font-weight: 500; }' 
      };
      const htmlIndex = starterFiles.findIndex(f => f.filename === 'index.html');
      if (htmlIndex >= 0) {
        starterFiles = [...starterFiles.slice(0, htmlIndex + 1), cssFile, ...starterFiles.slice(htmlIndex + 1)];
      } else {
        starterFiles = [cssFile, ...starterFiles];
      }
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
      codeTest: data.code_test || undefined,
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
