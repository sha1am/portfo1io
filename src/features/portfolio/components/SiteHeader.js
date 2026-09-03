import React, { useCallback, useEffect, useId, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { A11Y, HEADER_OFFSET, THEME } from '../../../shared/constants';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useScrollState } from '../../../shared/hooks/useScrollState';
import { useActiveSection } from '../../../shared/hooks/useActiveSection';

const themeIconProps = {
  className: 'icon',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: 'false',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SunIcon = () => (
  <svg {...themeIconProps}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.3 5.3 7 7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" />
  </svg>
);

const MoonIcon = () => (
  <svg {...themeIconProps}>
    <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" />
  </svg>
);

const SiteHeader = ({ navigationItems }) => {
  const { theme, toggleTheme } = useTheme();
  const { progress, isScrolled } = useScrollState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const location = useLocation();

  const sectionIds = useMemo(() => 
    navigationItems
      .filter((item) => !item.href.startsWith('/'))
      .map((item) => item.href.replace('#', '')),
    [navigationItems]
  );
  
  const activeId = useActiveSection(sectionIds, HEADER_OFFSET);

  const nextTheme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const topHref = `${location.pathname}${location.search}#top`;

  const handleTopClick = useCallback(() => {
    closeMenu();
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [closeMenu]);

  // Lock body scroll and trap Escape while the mobile menu is open.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        toggleRef.current?.focus();
      }
    };

    const onPointerDown = (event) => {
      if (
        !panelRef.current?.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isMenuOpen, closeMenu]);

  // Close the menu if the viewport grows back to desktop width.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)');
    const onChange = (event) => {
      if (event.matches) closeMenu();
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [closeMenu]);

  const renderLinks = (className) =>
    navigationItems.map((item) => {
      const isRouteLink = item.href.startsWith('/');
      const id = isRouteLink ? item.href.replace('/', '') : item.href.replace('#', '');
      const isActive = isRouteLink
        ? item.href === '/'
          ? location.pathname === '/'
          : location.pathname === item.href ||
            location.pathname.startsWith(`${item.href}/`)
        : id === activeId;
      
      if (isRouteLink) {
        return (
          <Link
            key={item.href}
            className={className}
            to={item.href}
            onClick={closeMenu}
            aria-current={isActive ? 'true' : undefined}
          >
            {item.label}
          </Link>
        );
      }
      
      return (
        <a
          key={item.href}
          className={className}
          href={item.href}
          onClick={closeMenu}
          aria-current={isActive ? 'true' : undefined}
        >
          {item.label}
        </a>
      );
    });

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <span
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <div className="site-header__inner">
        <Link
          className="brand"
          to={topHref}
          onClick={handleTopClick}
          aria-label={A11Y.LABELS.GO_TO_TOP}
        >
          <span className="brand-mark" aria-hidden="true">
            SA
          </span>
          <span className="brand-text">
            <span className="brand-name">Shadab Alam</span>
            <span className="brand-role">Backend Engineer</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label={A11Y.LABELS.PRIMARY_NAV}>
          {renderLinks('site-nav__link')}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={A11Y.LABELS.SWITCH_TO_THEME.replace('{theme}', nextTheme)}
          >
            {theme === THEME.DARK ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            ref={toggleRef}
            className={`icon-button menu-toggle${isMenuOpen ? ' is-open' : ''}`}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? A11Y.LABELS.CLOSE_MENU : A11Y.LABELS.OPEN_MENU}
          >
            <span className="menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        ref={panelRef}
        className={`mobile-nav${isMenuOpen ? ' is-open' : ''}`}
        hidden={!isMenuOpen}
      >
        <nav className="mobile-nav__list" aria-label="Mobile navigation">
          {renderLinks('mobile-nav__link')}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
