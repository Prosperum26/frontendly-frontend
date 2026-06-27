import type { EditorFile } from '../types/editor.types';

export function buildPreviewHtml(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;
}

export function buildPreviewDocument(files: EditorFile[]): string {
  let html = '';
  let css = '';
  let js = '';

  files.forEach(f => {
    if (f.language === 'html') html = f.content;
    if (f.language === 'css') css = f.content;
    if (f.language === 'js') js = f.content;
  });

  return buildPreviewHtml(html, css, js);
}

export function validatePreviewFiles(files: EditorFile[]): string[] {
  const errors: string[] = [];
  const hasContent = files.some(f => f.content.trim().length > 0);

  if (!hasContent) {
    errors.push('Document is empty. Add content before running the preview.');
  }

  return errors;
}
