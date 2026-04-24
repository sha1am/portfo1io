// Animation Constants
export const ANIMATION = {
  DURATIONS: {
    FAST: 180,
    NORMAL: 300,
    SLOW: 400,
    EXTRA_SLOW: 650,
    SLIDESHOW: 4000,
    MAGNIFIED: 2000,
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    CUBIC_BEZIER: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  DELAYS: {
    NONE: 0,
    SHORT: 120,
    NORMAL: 260,
    LONG: 850,
  },
};

// Theme Constants
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  STORAGE_KEY: 'theme',
  DEFAULT: 'dark',
};

// Experience Constants
export const EXPERIENCE = {
  CARD: {
    WIDTH: 320,
    HEIGHT: 380,
    PADDING: '1.5rem',
    GAP: '2rem',
    BORDER_RADIUS: '1.5rem',
  },
  DECK: {
    HEIGHT: 400,
    PERSPECTIVE: 1500,
    MIN_HEIGHT: 500,
  },
  TRANSFORMS: {
    SELECTED_SCALE: 1.1,
    SELECTED_TRANSLATE_Y: -15,
    ROTATION_DEGREES: 15,
    TRANSLATE_Z_FACTOR: 30,
  },
};


// Layout Constants
export const LAYOUT = {
  HEADER: {
    PADDING: '1.8rem clamp(1.4rem, 3vw, 2.8rem)',
    BORDER_RADIUS: '0 0 2rem 2rem',
    BACKDROP_BLUR: '24px',
  },
  BRAND: {
    MARK_SIZE: '3.2rem',
    MARK_BORDER_RADIUS: '1.5rem',
    FONT_SIZE: '1.3rem',
    GAP: '1rem',
  },
  THEME_CHIP: {
    SIZE: '3.2rem',
    BORDER_RADIUS: '1.8rem',
    ICON_SIZE: '1rem',
  },
  PANEL: {
    PADDING: '2rem',
    BORDER_RADIUS: '2rem',
    SCROLL_MARGIN_TOP: '7rem',
  },
  GRID: {
    GAP: '2rem',
    COLUMNS: 'repeat(2, minmax(0, 1fr))',
  },
};

// Color Constants
export const COLORS = {
  DARK: {
    TEXT: '#e8f4ff',
    MUTED: '#a8c7ff',
    ACCENT: '#4a9eff',
    ACCENT_LIGHT: '#7bb8ff',
    ACCENT_DARK: '#2d7dd2',
    BG_PRIMARY: '#0a0f1f',
    BG_SECONDARY: '#141927',
    BG_TERTIARY: '#1e2332',
    CARD_BG: 'rgba(20, 25, 39, 0.8)',
    HOVER_BG: 'rgba(74, 158, 255, 0.1)',
  },
  LIGHT: {
    TEXT: '#0f172a',
    MUTED: '#475569',
    ACCENT: '#3b82f6',
    ACCENT_LIGHT: '#60a5fa',
    ACCENT_DARK: '#1e40af',
    BG_PRIMARY: '#ffffff',
    BG_SECONDARY: '#f8fafc',
    BG_TERTIARY: '#f1f5f9',
    CARD_BG: 'rgba(255, 255, 255, 0.9)',
    HOVER_BG: 'rgba(59, 130, 246, 0.05)',
  },
};

// Theme CSS Variables
export const THEME_CSS_VARS = {
  DARK: {
    '--text': '#e8f4ff',
    '--muted': '#a8c7ff',
    '--accent': '#4a9eff',
    '--accent-light': '#7bb8ff',
    '--accent-dark': '#2d7dd2',
    '--line': 'rgba(74, 158, 255, 0.2)',
    '--line-strong': 'rgba(74, 158, 255, 0.4)',
    '--shadow': '0 8px 32px rgba(0, 0, 0, 0.4)',
    '--bg-primary': '#0a0f1f',
    '--bg-secondary': '#141927',
    '--bg-tertiary': '#1e2332',
    '--card-bg': 'rgba(20, 25, 39, 0.8)',
    '--hover-bg': 'rgba(74, 158, 255, 0.1)',
  },
  LIGHT: {
    '--text': '#0f172a',
    '--muted': '#475569',
    '--accent': '#3b82f6',
    '--accent-light': '#60a5fa',
    '--accent-dark': '#1e40af',
    '--line': 'rgba(59, 130, 246, 0.15)',
    '--line-strong': 'rgba(59, 130, 246, 0.3)',
    '--shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--card-bg': 'rgba(255, 255, 255, 0.9)',
    '--hover-bg': 'rgba(59, 130, 246, 0.05)',
  },
};

// Local Storage Constants
export const STORAGE = {
  KEYS: {
    THEME: 'theme',
  },
};

// Accessibility Constants
export const A11Y = {
  LABELS: {
    GO_TO_TOP: 'Go to top',
    PRIMARY_NAV: 'Primary',
    SWITCH_TO_THEME: 'Switch to {theme} theme',
  },
};

// Resume Constants
export const RESUME = {
  INITIAL_POSE: {
    rotateX: -7,
    rotateY: -14,
    rotateZ: 1.2,
    shiftX: 0,
    shiftY: 0,
  },
  RESET_DELAY: 650,
};
