export interface SandboxFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'jsx';
}

export interface Sandbox {
  id: string;
  name: string;
  files: SandboxFile[];
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_SANDBOX_FILES: SandboxFile[] = [
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Sandbox</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="root"></div>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: 'style.css',
    language: 'css',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.root-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
}

.root-card h1 {
  color: #333;
  margin-bottom: 1rem;
}

.root-card p {
  color: #666;
  line-height: 1.6;
}`,
  },
  {
    name: 'script.js',
    language: 'jsx',
    content: `// TODO: Use createRoot() to mount a small UI into the page.
// The import is already done for you — follow the steps in the
// exercise description to create the root and render your markup.

import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <div className="root-card">
    <h1>React Root Node</h1>
    <p>Learning createRoot()</p>
  </div>
);`,
  },
];
