// Safe localStorage wrapper for Next.js SSR compatibility

export const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

export const safeSessionStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  },
  
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  }
};
