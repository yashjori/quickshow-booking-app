const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const storage = {
  get(key, fallback = null) {
    if (typeof window === 'undefined') {
      return fallback;
    }
    return safeParse(window.localStorage.getItem(key), fallback);
  },

  set(key, value) {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  exists(key) {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem(key) !== null;
  },
};

