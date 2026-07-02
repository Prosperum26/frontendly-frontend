import type { EditorTab } from '../types/editor.types';

interface CodeTestLike {
  html?: string;
  css?: string;
  js?: string;
  jsx?: string;
  files?: { filename: string; language: string; content: string }[];
}

interface EditorFileInput {
  starter_files?: { filename: string; language: string; content: string }[];
  code_test?: CodeTestLike | null;
  evaluation_config?: {
    behavior?: boolean;
    visual?: boolean;
  };
  tags?: string[];
}

/** Derive editable file tabs from exercise metadata (mirrors backend seed shape). */
export function resolveEditorFilesFromBackend(data: EditorFileInput): EditorTab[] {
  // Use starter_files if available (new multi-file schema)
  if (data.starter_files && data.starter_files.length > 0) {
    return data.starter_files.map(file => file.filename);
  }

  // Fallback to code_test.files if available (solution reference)
  if (data.code_test?.files && data.code_test.files.length > 0) {
    return data.code_test.files.map(file => file.filename);
  }

  // Default fallback for exercises without starter_files
  const tags = data.tags ?? [];
  const isReact =
    data.evaluation_config?.behavior === true ||
    tags.some((tag) => /react/i.test(tag));

  if (isReact) {
    return ['jsx'];
  }

  return ['html', 'css', 'js'];
}
