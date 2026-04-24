import React from 'react';

const iconPaths = {
  github: (
    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .08 1.52 1.04 1.52 1.04.88 1.55 2.31 1.11 2.87.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.8c.85 0 1.7.12 2.49.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
  ),
  linkedin: (
    <path d="M6.94 8.5A1.44 1.44 0 1 0 6.94 5.62a1.44 1.44 0 0 0 0 2.88ZM5.7 10.2h2.5v8.1H5.7v-8.1Zm4.05 0h2.4v1.1h.04c.33-.62 1.16-1.28 2.38-1.28 2.55 0 3.03 1.73 3.03 3.98v4.3h-2.5v-3.81c0-.91-.02-2.08-1.23-2.08-1.24 0-1.42.99-1.42 2.01v3.88h-2.5v-8.1Z" />
  ),
  email: (
    <path
      d="M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm0 1.2 8.5 6 8.5-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const SocialLinks = ({ links }) => (
  <aside className="social-rail" aria-label="Social links">
    {links.map((link) => (
      <a key={link.label} className="social-link" href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {iconPaths[link.icon]}
        </svg>
      </a>
    ))}
  </aside>
);

export default SocialLinks;
