import React, { useState } from 'react';
import leetcodeLogo from '../../../assets/images/leetcode-logo.png';
import codeforcesLogo from '../../../assets/images/codeforces-logo.png';
import stratascratchLogo from '../../../assets/images/stratascratch-logo.png';

const LOGOS = {
  leetcode: { src: leetcodeLogo, initials: 'LC', color: '#ffa116' },
  codeforces: { src: codeforcesLogo, initials: 'CF', color: '#29b6f6' },
  stratascratch: { src: stratascratchLogo, initials: 'SS', color: '#66bb6a' },
};

/**
 * Renders the platform logo, falling back to a coloured monogram if the
 * image fails to load. The fallback is React state rather than direct DOM
 * mutation so it survives re-renders.
 */
const PlatformLogo = ({ logoType, name, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const logo = LOGOS[logoType];

  if (!logo) return null;

  if (failed) {
    return (
      <span
        className={`platform-logo platform-logo--fallback ${className}`.trim()}
        style={{ background: logo.color }}
        aria-hidden="true"
      >
        {logo.initials}
      </span>
    );
  }

  return (
    <img
      className={`platform-logo ${className}`.trim()}
      src={logo.src}
      alt=""
      width="24"
      height="24"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default PlatformLogo;
