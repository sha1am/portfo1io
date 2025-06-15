import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <a href="https://formdeclutter.netlify.app" target="_blank" rel="noopener noreferrer">
        Form Declutter Project
      </a>
      <a href="https://linkedin.com/in/sha1am" target="_blank" rel="noopener noreferrer">
        <img src="linkedin-logo.png" alt="LinkedIn" />
      </a>
      <a href="https://github.com/sha1am" target="_blank" rel="noopener noreferrer">
        <img src="github-logo.png" alt="GitHub" />
      </a>
    </footer>
  );
};

export default Footer;
