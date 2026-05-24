export const readJson = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
