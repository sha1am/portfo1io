import React, { useState, useEffect } from 'react';
import { THEME, STORAGE, A11Y, LAYOUT, THEME_CSS_VARS } from '../../../shared/constants';

const SiteHeader = ({ navigationItems }) => {
  const [theme, setTheme] = useState(THEME.DEFAULT);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE.KEYS.THEME) || THEME.DEFAULT;
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeVariables(savedTheme);
  }, []);

  const applyThemeVariables = (currentTheme) => {
    const root = document.documentElement;
    const themeVars = THEME_CSS_VARS[currentTheme.toUpperCase()];
    
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    applyThemeVariables(newTheme);
    localStorage.setItem(STORAGE.KEYS.THEME, newTheme);
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
        aria-label={A11Y.LABELS.SWITCH_TO_THEME.replace('{theme}', theme === THEME.DARK ? THEME.LIGHT : THEME.DARK)}
      >
        <span className={`theme-chip__icon ${theme === THEME.DARK ? 'theme-chip__moon' : 'theme-chip__sun'}`} />
      </button>
    </header>
  );
};

export default SiteHeader;
