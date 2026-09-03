import React from 'react';

/**
 * Single source of truth for the inline icons used across the site.
 * Stroke icons inherit `currentColor`; solid brand marks set their own fill.
 */
const paths = {
  github: {
    solid: true,
    node: (
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .08 1.52 1.04 1.52 1.04.88 1.55 2.31 1.11 2.87.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.8c.85 0 1.7.12 2.49.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    ),
  },
  linkedin: {
    solid: true,
    node: (
      <path d="M6.94 8.5A1.44 1.44 0 1 0 6.94 5.62a1.44 1.44 0 0 0 0 2.88ZM5.7 10.2h2.5v8.1H5.7v-8.1Zm4.05 0h2.4v1.1h.04c.33-.62 1.16-1.28 2.38-1.28 2.55 0 3.03 1.73 3.03 3.98v4.3h-2.5v-3.81c0-.91-.02-2.08-1.23-2.08-1.24 0-1.42.99-1.42 2.01v3.88h-2.5v-8.1Z" />
    ),
  },
  email: {
    node: (
      <path d="M3.8 5.6h16.4a1.2 1.2 0 0 1 1.2 1.2v10.4a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V6.8a1.2 1.2 0 0 1 1.2-1.2Zm-.6 1.6L12 13l8.8-5.8" />
    ),
  },
  phone: {
    node: (
      <path d="M7.2 3.6h2.6l1.1 3.2-1.5 1.2a11.4 11.4 0 0 0 3.6 3.6l1.2-1.5 3.2 1.1v2.6c0 .8-.65 1.45-1.45 1.45C9.75 16.2 4.9 11.35 4.9 5.05c0-.8.65-1.45 1.45-1.45Z" />
    ),
  },
  external: {
    node: <path d="M13.5 4.5h6v6M19.5 4.5 10 14M17 13.6v5.4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5.4" />,
  },
  document: {
    node: (
      <>
        <path d="M7 3.6h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4.1a.5.5 0 0 1 .5-.5H7Zm7 1.4v3.2h3.2" />
        <path d="M9 12.6h6M9 15.6h4.5" />
      </>
    ),
  },
  arrowUp: { node: <path d="M12 19.5v-15M5.5 11 12 4.5 18.5 11" /> },
  arrowLeft: { node: <path d="M19.5 12h-15M11 5.5 4.5 12l6.5 6.5" /> },
  arrowRight: { node: <path d="M4.5 12h15M13 5.5l6.5 6.5L13 18.5" /> },
  briefcase: {
    node: (
      <path d="M4 8.5h16M8 5.5h8M7 8.5v-3h10v3M6 8.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    ),
  },
  code: { node: <path d="m7 7-4 5 4 5M17 7l4 5-4 5M14 4l-4 16" /> },
  chart: { node: <path d="M4 19V5M4 19h16M7.5 14l3-3 2.5 2.5L18 8" /> },
  users: {
    node: (
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" />
    ),
  },
  pin: {
    node: (
      <>
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.6" />
      </>
    ),
  },
  calendar: {
    node: (
      <>
        <rect x="3.6" y="5.4" width="16.8" height="15" rx="2" />
        <path d="M3.6 10h16.8M8.4 3.6v3.6M15.6 3.6v3.6" />
      </>
    ),
  },
};

const Icon = ({ name, className = '' }) => {
  const icon = paths[name];
  if (!icon) return null;

  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={icon.solid ? 'currentColor' : 'none'}
      stroke={icon.solid ? 'none' : 'currentColor'}
      strokeWidth={icon.solid ? undefined : 1.6}
      strokeLinecap={icon.solid ? undefined : 'round'}
      strokeLinejoin={icon.solid ? undefined : 'round'}
    >
      {icon.node}
    </svg>
  );
};

export default Icon;
