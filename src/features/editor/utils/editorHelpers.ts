export const getDotInfo = (filename: string): { dotClass: string; dot: string } => {
  if (filename.endsWith('.html'))
    return { dotClass: 'code-editor__tab-dot--html', dot: '◆' };
  if (filename.endsWith('.css'))
    return { dotClass: 'code-editor__tab-dot--css', dot: '#' };
  if (filename.endsWith('.js'))
    return { dotClass: 'code-editor__tab-dot--js', dot: '⚡' };
  if (filename.endsWith('.jsx'))
    return { dotClass: 'code-editor__tab-dot--jsx', dot: '⚛' };
  return { dotClass: 'code-editor__tab-dot--js', dot: '📄' };
};

export const getMonacoLanguage = (filename: string): string => {
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.jsx')) return 'javascript';
  return 'plaintext';
};
