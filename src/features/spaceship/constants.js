/** Milliseconds the egg sits before it hatches. */
export const HATCH_DELAY_MS = 22000;

/** How long the crack animation runs before the ship appears. */
export const CRACK_DURATION_MS = 1400;

export const STORAGE_KEY = 'portfolio-spaceship';

/** Elements a shot can knock around. Transform-only, so layout is never affected. */
export const TARGET_SELECTOR = [
  '.section__title',
  '.hero__name',
  '.hero__role',
  '.stat__value',
  '.chip',
  '.timeline__role',
  '.project-card__title',
  '.achievement-card h3',
  '.profile-card__name',
].join(',');

export const PHYSICS = {
  /** px/s^2 applied while a thrust key is held. */
  THRUST: 1500,
  /** Exponential velocity decay per second: v *= e^(-DRAG * dt). */
  DRAG: 1.7,
  MAX_SPEED: 780,
  /** How hard the ship steers toward the cursor when flying itself. */
  SEEK: 620,
  /** Auto-pilot keeps this far from the cursor so it orbits instead of sitting on it. */
  SEEK_STANDOFF: 130,
  BULLET_SPEED: 900,
  BULLET_LIFE: 1.1,
  FIRE_COOLDOWN: 0.13,
  AUTO_FIRE_COOLDOWN: 0.55,
  BOUNCE: 0.55,
};
