export const saveToLocalStorage = <T>(key: string, value: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return fallback;
      }
    }
  }
  return fallback;
};

export const clearFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
