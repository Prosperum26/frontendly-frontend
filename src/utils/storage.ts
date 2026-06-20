export type StorageType = 'cookie' | 'localStorage' | 'sessionStorage';

export const guestProgressStorage = {
  get(key: string, type: StorageType): any {
    if (type === 'cookie') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${key}=`);
      if (parts.length === 2) {
        try {
          return JSON.parse(decodeURIComponent(parts.pop()?.split(';').shift() || ''));
        } catch {
          return null;
        }
      }
      return null;
    }
    if (type === 'sessionStorage') {
      const val = sessionStorage.getItem(key);
      try {
        return val ? JSON.parse(val) : null;
      } catch {
        return null;
      }
    }
    // Default to localStorage
    const val = localStorage.getItem(key);
    try {
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  set(key: string, value: any, type: StorageType): void {
    const strValue = JSON.stringify(value);
    if (type === 'cookie') {
      const date = new Date();
      date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      document.cookie = `${key}=${encodeURIComponent(strValue)}; expires=${date.toUTCString()}; path=/`;
      return;
    }
    if (type === 'sessionStorage') {
      sessionStorage.setItem(key, strValue);
      return;
    }
    localStorage.setItem(key, strValue);
  },

  remove(key: string, type: StorageType): void {
    if (type === 'cookie') {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return;
    }
    if (type === 'sessionStorage') {
      sessionStorage.removeItem(key);
      return;
    }
    localStorage.removeItem(key);
  }
};
