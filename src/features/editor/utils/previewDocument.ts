import type { WorkspaceFiles } from '../types/editor.types';

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

export function buildPreviewDocument(files: WorkspaceFiles): string {
  return buildPreviewHtml(files.html, files.css, files.js);
}

export function validatePreviewFiles(files: WorkspaceFiles): string[] {
  const errors: string[] = [];
  const hasHtml = files.html.trim().length > 0;
  const hasCss = files.css.trim().length > 0;
  const hasJs = files.js.trim().length > 0;

  if (!hasHtml && !hasCss && !hasJs) {
    errors.push('Document is empty. Add HTML, CSS, or JS before running the preview.');
  }

  if ((hasCss || hasJs) && !hasHtml) {
    errors.push('CSS or JS is present, but the HTML document is empty.');
  }

  return errors;
}
