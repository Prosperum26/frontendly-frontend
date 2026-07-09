import { describe, it, expect } from 'vitest';
import { getDotInfo, getMonacoLanguage } from './editorHelpers';

describe('editorHelpers', () => {
  describe('getDotInfo', () => {
    it('returns correct dot info for HTML files', () => {
      const result = getDotInfo('index.html');
      expect(result).toEqual({
        dotClass: 'code-editor__tab-dot--html',
        dot: '◆'
      });
    });

    it('returns correct dot info for CSS files', () => {
      const result = getDotInfo('style.css');
      expect(result).toEqual({
        dotClass: 'code-editor__tab-dot--css',
        dot: '#'
      });
    });

    it('returns correct dot info for JS files', () => {
      const result = getDotInfo('script.js');
      expect(result).toEqual({
        dotClass: 'code-editor__tab-dot--js',
        dot: '⚡'
      });
    });

    it('returns correct dot info for JSX files', () => {
      const result = getDotInfo('App.jsx');
      expect(result).toEqual({
        dotClass: 'code-editor__tab-dot--jsx',
        dot: '⚛'
      });
    });

    it('returns default dot info for unknown file types', () => {
      const result = getDotInfo('unknown.txt');
      expect(result).toEqual({
        dotClass: 'code-editor__tab-dot--js',
        dot: '📄'
      });
    });
  });

  describe('getMonacoLanguage', () => {
    it('returns html for HTML files', () => {
      expect(getMonacoLanguage('index.html')).toBe('html');
    });

    it('returns css for CSS files', () => {
      expect(getMonacoLanguage('style.css')).toBe('css');
    });

    it('returns javascript for JS files', () => {
      expect(getMonacoLanguage('script.js')).toBe('javascript');
    });

    it('returns javascript for JSX files', () => {
      expect(getMonacoLanguage('App.jsx')).toBe('javascript');
    });

    it('returns plaintext for unknown file types', () => {
      expect(getMonacoLanguage('unknown.txt')).toBe('plaintext');
    });
  });
});
