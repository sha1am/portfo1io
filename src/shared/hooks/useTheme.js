import { useCallback, useEffect, useState } from 'react';
import { THEME, STORAGE } from '../constants';

const readStoredTheme = () => {
  if (typeof window === 'undefined') return THEME.DEFAULT;
  try {
    const stored = window.localStorage.getItem(STORAGE.KEYS.THEME);
    if (stored === THEME.DARK || stored === THEME.LIGHT) return stored;
  } catch (error) {
    /* localStorage can be unavailable in private mode - fall through */
  }
  return document.documentElement.getAttribute('data-theme') || THEME.DEFAULT;
};

/**
 * Reads the theme the inline script in index.html already applied, so the
 * first paint and the first React render always agree (no flash).
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE.KEYS.THEME, theme);
    } catch (error) {
      /* ignore write failures */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  return { theme, toggleTheme };
};
