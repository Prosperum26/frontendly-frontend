import { useState } from 'react';
import { editorService } from '../services/editor.service';
import type { EvaluationResult } from '../types/editor.types';

export const useEvaluation = () => {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const evaluate = async (code: string, language: string) => {
    setLoading(true);
    try {
      const data = await editorService.submitCode(code, language);
      setResult(data);
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, evaluate };
};

export default useEvaluation;
