import React from 'react';
import portrait from '../../../assets/images/profile-picture.png';
import ResumeStage from './ResumeStage';
import SocialLinks from './SocialLinks';

const HeroSection = ({ heroContent, socialLinks, resumeCards, resumeAsset }) => (
  <section className="hero-section">
    <SocialLinks links={socialLinks} />

    <div className="hero-copy">
      <div className="portrait-frame">
        <div className="portrait-aura" />
        <img src={portrait} alt="Portrait of Shadab Alam" className="hero-portrait" />
      </div>

      <p className="eyebrow">{heroContent.greeting}</p>
      <h1>{heroContent.name}</h1>
      <p className="hero-role">{heroContent.role}</p>
      <div className="hero-divider" />
      <p className="hero-summary">
        {heroContent.highlights.map((highlight) => (
          <span key={highlight}>{highlight}</span>
        ))}
      </p>

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
