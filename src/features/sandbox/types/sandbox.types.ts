export interface SandboxFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript';
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
  <div class="container">
    <h1>Hello, World!</h1>
    <p>Start coding here...</p>
  </div>
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

.container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}`,
  },
  {
    name: 'script.js',
    language: 'javascript',
    content: `console.log('Sandbox loaded!');

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  
  container.addEventListener('click', () => {
    container.style.transform = 'scale(1.05)';
    setTimeout(() => {
      container.style.transform = 'scale(1)';
    }, 200);
  });
});`,
  },
];
