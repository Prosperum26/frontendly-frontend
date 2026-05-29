import api from '../../../services/api';
import type { EvaluationResult, WorkspaceSubmitRequest } from '../types/editor.types';

function includesAny(value: string, patterns: string[]): boolean {
  const normalized = value.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern));
}

function createMockEvaluation(request: WorkspaceSubmitRequest): EvaluationResult {
  const css = request.files.css.toLowerCase();
  const html = request.files.html.toLowerCase();
  const criteria = [
    {
      id: 'grid-layout',
      label: 'Use CSS Grid with a 2-column asymmetric layout',
      passed: includesAny(css, ['display: grid', 'display:grid']) && includesAny(css, ['1fr', 'grid-template-columns']),
    },
    {
      id: 'hero-span',
      label: 'Hero cell spans 2 rows on the left column',
      passed:
        html.includes('hero-cell') &&
        includesAny(css, ['grid-row', 'span 2', '1 / 3', '1/3']),
    },
    {
      id: '3',
      label: 'Maintain 16px gap between all grid items',
      passed: includesAny(css, ['gap: 16px', 'gap:16px']),
    },
    {
      id: 'responsive',
      label: 'Layout remains fluid on viewports under 768px',
      passed: includesAny(css, ['@media', 'max-width: 768px', 'max-width:768px']),
    },
  ];

  const passedCount = criteria.filter((criterion) => criterion.passed).length;

  return {
    passed: passedCount === criteria.length,
    output: `Checked ${criteria.length} requirements. ${passedCount}/${criteria.length} passed.`,
    executionTime: 180,
    criteria,
  };
}

export const editorService = {
  async submitWorkspace(request: WorkspaceSubmitRequest): Promise<EvaluationResult> {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 450);
    });

    return createMockEvaluation(request);
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
