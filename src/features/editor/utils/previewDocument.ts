import type { WorkspaceFiles } from '../types/editor.types';

export function buildPreviewDocument(files: WorkspaceFiles): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${files.css}
  </style>
</head>
<body>
${files.html}
</body>
</html>`;
}
