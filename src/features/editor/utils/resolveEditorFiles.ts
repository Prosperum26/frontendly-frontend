import type { EditorTab } from '../types/editor.types';

interface CodeTestLike {
  html?: string;
  css?: string;
  js?: string;
  jsx?: string;
}

interface EditorFileInput {
  html_content?: string;
  css_content?: string;
  js_content?: string;
  jsx_content?: string;
  code_test?: CodeTestLike | null;
  evaluation_config?: {
    behavior?: boolean;
    visual?: boolean;
  };
  tags?: string[];
}

/** Derive editable file tabs from exercise metadata (mirrors backend seed shape). */
export function resolveEditorFilesFromBackend(data: EditorFileInput): EditorTab[] {
  const tags = data.tags ?? [];
  const isReact =
    data.evaluation_config?.behavior === true ||
    tags.some((tag) => /react/i.test(tag));

  if (isReact) {
    return ['jsx'];
  }

  const starterHas = {
    html: (data.html_content ?? '').trim().length > 0,
    css: (data.css_content ?? '').trim().length > 0,
    js: (data.js_content ?? '').trim().length > 0,
    jsx: (data.jsx_content ?? '').trim().length > 0,
  };

  const tabs: EditorTab[] = [];
  if (starterHas.html) tabs.push('html');
  if (starterHas.css) tabs.push('css');
  if (starterHas.js) tabs.push('js');
  if (starterHas.jsx) tabs.push('jsx');

  if (tabs.length > 0) return tabs;

  const codeTest = data.code_test;
  if (codeTest) {
    const testTabs: EditorTab[] = [];
    if ((codeTest.jsx ?? '').trim()) testTabs.push('jsx');
    if ((codeTest.html ?? '').trim() && !testTabs.includes('jsx')) testTabs.push('html');
    if ((codeTest.css ?? '').trim() && !testTabs.includes('jsx')) testTabs.push('css');
    if ((codeTest.js ?? '').trim()) testTabs.push('js');
    if (testTabs.length > 0) return testTabs;
  }

  if (data.evaluation_config?.visual) {
    return ['jsx'];
  }

  return ['html', 'css', 'js'];
}
