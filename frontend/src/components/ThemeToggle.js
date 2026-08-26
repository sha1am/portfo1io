import React, { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

const getInitialTheme = () => localStorage.getItem('portfolio-theme') || 'dark';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {nextTheme === 'light' ? (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="12" />
          <path d="M32 6v9M32 49v9M6 32h9M49 32h9M13.6 13.6l6.4 6.4M44 44l6.4 6.4M50.4 13.6 44 20M20 44l-6.4 6.4" />
        </svg>
      ) : (
        <span aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
