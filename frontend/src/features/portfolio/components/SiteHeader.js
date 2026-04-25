import React, { useState, useEffect } from 'react';
import { THEME, STORAGE, A11Y } from '../../../shared/constants';

const SiteHeader = ({ navigationItems }) => {
  const [theme, setTheme] = useState(THEME.DEFAULT);
  const nextTheme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
  const isSwitchingToLight = nextTheme === THEME.LIGHT;

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE.KEYS.THEME) || THEME.DEFAULT;
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(STORAGE.KEYS.THEME, nextTheme);
  };

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={A11Y.LABELS.GO_TO_TOP}>
        <span className="brand-mark">SA</span>
        <span className="brand-name">Shadab Alam</span>
      </a>

      <nav className="site-nav" aria-label={A11Y.LABELS.PRIMARY_NAV}>
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <button 
        className="theme-chip" 
        type="button" 
        onClick={toggleTheme}
        aria-label={A11Y.LABELS.SWITCH_TO_THEME.replace('{theme}', nextTheme)}
      >
        {isSwitchingToLight ? (
          <svg className="theme-chip__icon theme-chip__sun" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="13" />
            <path d="M32 6v9M32 49v9M6 32h9M49 32h9M13.6 13.6l6.4 6.4M44 44l6.4 6.4M50.4 13.6 44 20M20 44l-6.4 6.4" />
          </svg>
        ) : (
          <span className="theme-chip__icon theme-chip__moon" />
        )}
      </button>
    </header>
  );
};

export default SiteHeader;
