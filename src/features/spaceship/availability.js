import { SNOOZE_DAYS, STORAGE_KEY } from './constants';

/**
 * True on visits where the toy makes sense at all: a device with a real
 * cursor to chase, enough room to fly, and no request for reduced motion.
 * Deliberately does NOT consider the snooze - the footer trigger must keep
 * working even for someone who dismissed the automatic hatch.
 */
export const canRunSpaceship = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  return window.innerWidth >= 900;
};

/** True while the visitor has recently dismissed the ship. */
export const isSnoozed = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const until = Number(raw);
    // Older builds stored the string 'dismissed', which never expired and left
    // people with no way to see the egg again. Treat it as no longer snoozed.
    if (!Number.isFinite(until)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    return Date.now() < until;
  } catch (error) {
    return false;
  }
};

export const snooze = () => {
  try {
    const until = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(STORAGE_KEY, String(until));
  } catch (error) {
    /* private mode - the ship simply reappears next visit */
  }
};
