import { useState } from 'react';
import type { EditorState } from '../types/editor.types';

export const useEditorState = (initialCode: string = '') => {
  const [state, setState] = useState<EditorState>({
    code: initialCode,
    language: 'javascript',
    isDirty: false,
  });

  const setCode = (code: string) => {
    setState((prev) => ({ ...prev, code, isDirty: true }));
  };

  const setLanguage = (language: string) => {
    setState((prev) => ({ ...prev, language, isDirty: true }));
  };

  const reset = () => {
    setState({ code: initialCode, language: 'javascript', isDirty: false });
  };

  return { state, setCode, setLanguage, reset };
};

export default useEditorState;
