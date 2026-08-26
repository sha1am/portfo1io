import React from 'react';
import Icon from './Icon';

const SiteFooter = ({ socialLinks, navigationItems }) => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="site-footer__brand">
        <span className="brand-mark" aria-hidden="true">
          SA
        </span>
        <p>
          Backend engineer building reliable, well-architected systems in Go and
          Python.
        </p>
      </div>

      <nav className="site-footer__nav" aria-label="Footer navigation">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-footer__social">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <Icon name={link.icon} />
          </a>
        ))}
      </div>
    </div>

    <div className="site-footer__base">
      <p>&copy; {new Date().getFullYear()} Shadab Alam. All rights reserved.</p>
      <p>Built with React and Webpack.</p>
    </div>
  </footer>
);

export default SiteFooter;
