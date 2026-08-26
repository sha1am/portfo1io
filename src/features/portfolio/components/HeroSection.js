import React, { useEffect, useState } from 'react';
import portrait from '../../../assets/images/profile-picture.png';
import Icon from './Icon';
import CodingProfiles from './CodingProfiles';

const ROTATE_INTERVAL = 2800;

const RoleRotator = ({ roles }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <p className="hero__role" aria-live="polite">
      <span key={index} className="hero__role-text">
        {roles[index]}
      </span>
    </p>
  );
};

const HeroSection = ({
  heroContent,
  socialLinks,
  resumeAsset,
  codingProfiles,
  codingStatsUpdatedAt,
}) => (
  <section className="hero" aria-labelledby="hero-name">
    <div className="hero__grid">
      <div className="hero__content">
        {heroContent.availability && (
          <p className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {heroContent.availability}
          </p>
        )}

        <p className="hero__greeting">{heroContent.greeting}</p>
        <h1 className="hero__name" id="hero-name">
          {heroContent.name}
        </h1>
        <RoleRotator roles={heroContent.roles} />

        <p className="hero__summary">{heroContent.summary}</p>

        <ul className="hero__points">
          {heroContent.summaryPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="hero__actions">
          <a
            className="button button--primary"
            href={resumeAsset.viewUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="document" />
            {heroContent.primaryActionLabel}
          </a>
          <a className="button button--ghost" href="#contact">
            {heroContent.secondaryActionLabel}
            <Icon name="arrowRight" />
          </a>
        </div>

        <div className="hero__social">
          <span className="hero__social-label">Find me on</span>
          <div className="hero__social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="social-link"
                href={link.href}
                aria-label={link.label}
                {...(link.external
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                <Icon name={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__aside">
        <figure className="portrait">
          <span className="portrait__glow" aria-hidden="true" />
          <img
            className="portrait__image"
            src={portrait}
            alt="Shadab Alam"
            width="420"
            height="420"
            fetchpriority="high"
          />
        </figure>

        <CodingProfiles
          initialProfiles={codingProfiles}
          updatedAt={codingStatsUpdatedAt}
        />
      </div>
    </div>

    <a className="scroll-cue" href="#about" aria-label="Scroll to About section">
      <span className="scroll-cue__mouse" aria-hidden="true">
        <span className="scroll-cue__wheel" />
      </span>
      <span className="scroll-cue__label">Scroll</span>
    </a>
  </section>
);

export default HeroSection;
