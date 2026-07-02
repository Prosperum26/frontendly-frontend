import type { EditorFile } from '../types/editor.types';

export function buildPreviewHtml(html: string, css: string, js: string, jsx?: string): string {
  if (jsx && jsx.trim()) {
    // React/JSX preview - remove export default to make it work with Babel standalone
    let jsxWithoutExport = jsx
      .replace(/export default function\s+(\w+)/, 'function $1')
      .replace(/export default\s+/, '');

    // Remove all import statements since we load React/ReactDOM globally
    jsxWithoutExport = jsxWithoutExport.replace(/import\s+.*from\s+['"].*['"];?\s*/g, '');

    // If HTML is provided, use it; otherwise use default with root div
    const htmlContent = html || '<div id="root"></div>';

    // Check if JSX already contains createRoot() call (like exercise_s2)
    const hasCreateRoot = jsx.includes('createRoot');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${css}
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
${htmlContent}
  <script>
    // Make createRoot available globally for user code
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      window.createRoot = ReactDOM.createRoot;
    }
  </script>
  <script type="text/babel">
${jsxWithoutExport}
  </script>
  ${!hasCreateRoot ? `
  <script type="text/babel">
    const root = ReactDOM.createRoot(document.getElementById('root'));
    // Try to find the default exported component
    if (typeof App !== 'undefined') {
      root.render(<App />);
    } else if (typeof Welcome !== 'undefined') {
      root.render(<Welcome />);
    } else if (typeof Profile !== 'undefined') {
      root.render(<Profile />);
    } else if (typeof ProfileCard !== 'undefined') {
      root.render(<ProfileCard />);
    } else if (typeof Button !== 'undefined') {
      root.render(<Button />);
    } else if (typeof StatusBadge !== 'undefined') {
      root.render(<StatusBadge />);
    } else {
      // Try to find any component that might be the main one
      const components = Object.keys(window).filter(key => 
        typeof window[key] === 'function' && 
        key !== 'React' && 
        key !== 'ReactDOM' &&
        key[0] === key[0].toUpperCase()
      );
      if (components.length > 0) {
        const MainComponent = window[components[0]];
        root.render(<MainComponent />);
      }
    }
  </script>` : ''}
</body>
</html>`;
  }

  // Standard HTML/CSS/JS preview
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
  let jsx = '';

  files.forEach(f => {
    if (f.language === 'html') html = f.content;
    if (f.language === 'css') css = f.content;
    if (f.language === 'js') js = f.content;
    if (f.language === 'jsx') jsx = f.content;
  });

  return buildPreviewHtml(html, css, js, jsx);
}

export function validatePreviewFiles(files: EditorFile[]): string[] {
  const errors: string[] = [];
  const hasContent = files.some(f => f.content.trim().length > 0);

  if (!hasContent) {
    errors.push('Document is empty. Add content before running the preview.');
  }

  return errors;
}
