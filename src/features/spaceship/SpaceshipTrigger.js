import React, { useEffect, useState } from 'react';
import { HATCH_EVENT } from './constants';
import { canRunSpaceship } from './availability';

/**
 * The way back to the easter egg. Lives quietly in the footer so it is always
 * reachable once someone knows it exists, without competing with the content
 * above it.
 */
const SpaceshipTrigger = () => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(canRunSpaceship());
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      className="egg-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent(HATCH_EVENT))}
      title="Hatch the egg"
      aria-label="Hatch the easter egg"
    >
      <span className="egg-trigger__egg" aria-hidden="true" />
      <span className="egg-trigger__label">Hatch</span>
    </button>
  );
};

export default SpaceshipTrigger;
