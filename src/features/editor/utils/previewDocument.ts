import type { WorkspaceFiles } from '../types/editor.types';

export function buildPreviewHtml(html: string, css: string): string {
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
</body>
</html>`;
}

export function buildPreviewDocument(files: WorkspaceFiles): string {
  return buildPreviewHtml(files.html, files.css);
}

export function validatePreviewFiles(files: WorkspaceFiles): string[] {
  const errors: string[] = [];
  const hasHtml = files.html.trim().length > 0;
  const hasCss = files.css.trim().length > 0;

  if (!hasHtml && !hasCss) {
    errors.push('Document is empty. Add HTML or CSS before running the preview.');
  }

  if (hasCss && !hasHtml) {
    errors.push('CSS is present, but the HTML document is empty.');
  }

  return errors;
}
