import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const Header = () => (
  <header className="header">
    <a className="brand" href="#home" aria-label="Go to home">
      <span>SA</span>
      <strong>Shadab Alam</strong>
    </a>

    <nav aria-label="Primary navigation">
      {navItems.map((item) => (
        <a href={item.href} key={item.href}>
          {item.label}
        </a>
      ))}
    </nav>

    <ThemeToggle />
  </header>
);

export default Header;
