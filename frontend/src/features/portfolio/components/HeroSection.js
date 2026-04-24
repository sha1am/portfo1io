import React, { useState, useEffect } from 'react';
import portrait from '../../../assets/images/profile-picture.png';
import ResumeStage from './ResumeStage';
import SocialLinks from './SocialLinks';

const RoleRotator = ({ roles }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000); // Change role every 3 seconds

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <p className="hero-role">
      {roles[currentRoleIndex]}
    </p>
  );
};

const HeroSection = ({ heroContent, socialLinks, resumeCards, resumeAsset, aboutSection }) => (
  <section className="hero-section">
    <SocialLinks links={socialLinks} />

    <div className="hero-copy">
      <div className="portrait-frame">
        <div className="portrait-aura" />
        <div className="portrait-light" />
        <img src={portrait} alt="Portrait of Shadab Alam" className="hero-portrait" />
      </div>

      <p className="eyebrow">{heroContent.greeting}</p>
      <h1>{heroContent.name}</h1>
      <RoleRotator roles={heroContent.roles} />
      <div className="hero-divider" />
      <div className="hero-summary">
        {aboutSection.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="hero-actions">
        <a className="primary-button" href={resumeAsset.viewUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5h.5Zm7 1.5v3h3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 12h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {heroContent.primaryActionLabel}
        </a>
        <a className="ghost-button" href="#contact">
          {heroContent.secondaryActionLabel}
        </a>
      </div>
    </div>

    <ResumeStage cards={resumeCards} resumeAsset={resumeAsset} />
  </section>
);

export default HeroSection;
