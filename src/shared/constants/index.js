export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  DEFAULT: 'dark',
};

export const STORAGE = {
  KEYS: {
    THEME: 'portfolio-theme',
  },
};

/**
 * The y-coordinate the nav uses to decide which section is active.
 *
 * Must stay GREATER than `.section { scroll-margin-top }` in portfolio.css
 * (header height + 1.5rem = 96px). An anchor click parks the target section's
 * top edge at exactly that scroll-margin, so a smaller value here would leave
 * the target just below the line and highlight the previous section instead.
 */
export const HEADER_OFFSET = 120;

export const A11Y = {
  LABELS: {
    GO_TO_TOP: 'Back to top',
    PRIMARY_NAV: 'Primary navigation',
    OPEN_MENU: 'Open navigation menu',
    CLOSE_MENU: 'Close navigation menu',
    SKIP_TO_CONTENT: 'Skip to main content',
    SWITCH_TO_THEME: 'Switch to {theme} theme',
  },
};
