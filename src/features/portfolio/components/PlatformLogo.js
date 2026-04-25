import React from 'react';
import leetcodeLogo from '../../../assets/images/leetcode-logo.png';
import codeforcesLogo from '../../../assets/images/codeforces-logo.png';
import stratascratchLogo from '../../../assets/images/stratascratch-logo.png';

const PlatformLogo = ({ logoType, className = "" }) => {
  const getLogoSrc = () => {
    switch (logoType) {
      case 'leetcode':
        return leetcodeLogo;
      case 'codeforces':
        return codeforcesLogo;
      case 'stratascratch':
        return stratascratchLogo;
      default:
        return null;
    }
  };

  const getFallbackSVG = () => {
    switch (logoType) {
      case 'leetcode':
        return (
          <svg viewBox="0 0 24 24" className={className}>
            <circle cx="12" cy="12" r="10" fill="#ffa116"/>
            <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">LC</text>
          </svg>
        );
      case 'codeforces':
        return (
          <svg viewBox="0 0 24 24" className={className}>
            <circle cx="12" cy="12" r="10" fill="#29b6f6"/>
            <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CF</text>
          </svg>
        );
      case 'stratascratch':
        return (
          <svg viewBox="0 0 24 24" className={className}>
            <circle cx="12" cy="12" r="10" fill="#66bb6a"/>
            <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">SS</text>
          </svg>
        );
      default:
        return null;
    }
  };

  const logoSrc = getLogoSrc();
  const fallbackSVG = getFallbackSVG();
  
  if (!logoSrc && !fallbackSVG) {
    return null;
  }

  return (
    <div className="platform-logo-container">
      {logoSrc && (
        <img 
          src={logoSrc} 
          alt={`${logoType} logo`}
          className={`platform-logo-img ${className}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      )}
      <div className="platform-logo-fallback" style={{ display: logoSrc ? 'none' : 'block' }}>
        {fallbackSVG}
      </div>
    </div>
  );
};

export default PlatformLogo;
