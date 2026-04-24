import React from 'react';

const SiteHeader = ({ navigationItems }) => (
  <header className="site-header">
    <a className="brand" href="#top" aria-label="Go to top">
      <span className="brand-mark">SA</span>
      <span className="brand-name">Shadab Alam</span>
    </a>

    <nav className="site-nav" aria-label="Primary">
      {navigationItems.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>

    <button className="theme-chip" type="button" aria-label="Theme preview">
      <span className="theme-chip__moon" />
    </button>
  </header>
);

export default SiteHeader;
