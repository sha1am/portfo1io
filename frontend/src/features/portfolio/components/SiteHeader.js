import React, { useState, useEffect } from 'react';
import { THEME, STORAGE, A11Y } from '../../../shared/constants';

const SiteHeader = ({ navigationItems }) => {
  const [theme, setTheme] = useState(THEME.DEFAULT);
  const nextTheme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

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
        <span className={`theme-chip__icon ${nextTheme === THEME.LIGHT ? 'theme-chip__sun' : 'theme-chip__moon'}`} />
      </button>
    </header>
  );
};

export default SiteHeader;
