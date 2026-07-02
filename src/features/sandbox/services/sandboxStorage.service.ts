import type { Sandbox, SandboxFile } from '../types/sandbox.types';
import { DEFAULT_SANDBOX_FILES } from '../types/sandbox.types';

const SANDBOX_STORAGE_KEY = 'frontendly_sandboxes';
const MAX_SANDBOXES = 5;

export class SandboxStorageService {
  private static getSandboxes(): Sandbox[] {
    try {
      const stored = localStorage.getItem(SANDBOX_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load sandboxes from storage:', error);
      return [];
    }
  }

  private static saveSandboxes(sandboxes: Sandbox[]): void {
    try {
      localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(sandboxes));
    } catch (error) {
      console.error('Failed to save sandboxes to storage:', error);
    }
  }

  static getAllSandboxes(): Sandbox[] {
    return this.getSandboxes().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  static getSandboxById(id: string): Sandbox | null {
    const sandboxes = this.getSandboxes();
    return sandboxes.find(s => s.id === id) || null;
  }

  static createSandbox(name: string): Sandbox {
    const sandboxes = this.getSandboxes();
    
    if (sandboxes.length >= MAX_SANDBOXES) {
      throw new Error(`Maximum ${MAX_SANDBOXES} sandboxes allowed. Delete some first.`);
    }

    const newSandbox: Sandbox = {
      id: `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      files: DEFAULT_SANDBOX_FILES.map(file => ({ ...file })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    sandboxes.push(newSandbox);
    this.saveSandboxes(sandboxes);
    return newSandbox;
  }

  static updateSandbox(id: string, updates: Partial<Sandbox>): Sandbox | null {
    const sandboxes = this.getSandboxes();
    const index = sandboxes.findIndex(s => s.id === id);
    
    if (index === -1) return null;

    sandboxes[index] = {
      ...sandboxes[index],
      ...updates,
      updatedAt: Date.now(),
    };

    this.saveSandboxes(sandboxes);
    return sandboxes[index];
  }

  static updateSandboxFiles(id: string, files: SandboxFile[]): Sandbox | null {
    return this.updateSandbox(id, { files });
  }

  static deleteSandbox(id: string): boolean {
    const sandboxes = this.getSandboxes();
    const filtered = sandboxes.filter(s => s.id !== id);
    
    if (filtered.length === sandboxes.length) return false;

    this.saveSandboxes(filtered);
    return true;
  }

  static canCreateSandbox(): boolean {
    return this.getSandboxes().length < MAX_SANDBOXES;
  }

  static getSandboxCount(): number {
    return this.getSandboxes().length;
  }
}
