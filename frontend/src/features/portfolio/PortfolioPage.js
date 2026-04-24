import React, { useState, useEffect } from 'react';
import {
  aboutSection,
  achievementsSection,
  contactCards,
  experienceCards,
  heroContent,
  navigationItems,
  projectCards,
  resumeCards,
  resumeAsset,
  skillsSection,
  socialLinks,
  stats,
} from './data/content';
import { EXPERIENCE } from '../../shared/constants';
import { get } from '../../shared/api/client';
import HeroSection from './components/HeroSection';
import SectionPanel from './components/SectionPanel';
import SiteHeader from './components/SiteHeader';
import StatsStrip from './components/StatsStrip';

const ExperienceDeck = ({ experiences }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleCardClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const getCardTransform = (index) => {
    if (index === selectedIndex) {
      return `scale(${EXPERIENCE.TRANSFORMS.SELECTED_SCALE}) translateY(${EXPERIENCE.TRANSFORMS.SELECTED_TRANSLATE_Y}px)`;
    }
    const rotation = (index - experiences.length / 2) * EXPERIENCE.TRANSFORMS.ROTATION_DEGREES;
    const translateZ = -Math.abs(index - experiences.length / 2) * EXPERIENCE.TRANSFORMS.TRANSLATE_Z_FACTOR;
    return `rotateY(${rotation}deg) translateZ(${translateZ}px)`;
  };

  return (
    <div className="timeline experience-deck">
      <div className="experience-deck__container">
        {experiences.map((exp, index) => (
          <div
            key={`${exp.range}-${exp.role}-${index}`}
            className={`experience-card ${index === selectedIndex ? 'is-selected' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{
              transform: getCardTransform(index)
            }}
          >
            <div className="experience-card__content">
              <p className="timeline-card__range">{exp.range}</p>
              <h3>{exp.role}</h3>
              <p className="timeline-card__company">{exp.company}</p>
              {exp.location && <p className="timeline-card__location">{exp.location}</p>}
              <ul>
                {exp.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {exp.techStack && (
                <div className="timeline-card__tech-stack">
                  {exp.techStack.map((tech) => (
                    <span key={tech} className="tech-chip">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioPage = () => {
  const [apiStatus, setApiStatus] = useState({
    state: 'loading',
    label: 'Checking API',
  });

  useEffect(() => {
    let isActive = true;

    get('/api/status')
      .then((response) => {
        if (!isActive) {
          return;
        }

        setApiStatus({
          state: 'online',
          label: `${response.service} online`,
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setApiStatus({
          state: 'offline',
          label: 'API unavailable',
        });
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="app-background" />
      <SiteHeader navigationItems={navigationItems} />

      <main className="landing-page" id="top">
        <HeroSection
          heroContent={heroContent}
          socialLinks={socialLinks}
          resumeCards={resumeCards}
          resumeAsset={resumeAsset}
          apiStatus={apiStatus}
        />

        <div className="scroll-cue">Scroll Down</div>
        <StatsStrip items={stats} />

        <section className="content-grid">
          <SectionPanel id="about" eyebrow={aboutSection.eyebrow} title={aboutSection.title}>
            {aboutSection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SectionPanel>

          <SectionPanel id="skills" eyebrow={skillsSection.eyebrow} title={skillsSection.title}>
            <div className="chip-grid">
              {skillsSection.items.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel id="projects" eyebrow="Projects" title="Selected work that balances engineering depth with product feel." wide>
            <div className="card-grid">
              {projectCards.map((project) => (
                <article key={project.title} className="content-card">
                  <p className="content-card__tag">{project.tag}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  {project.links && (
                    <div className="content-card__links">
                      {project.links.website && (
                        <a href={project.links.website} target="_blank" rel="noreferrer" className="content-card__link">
                          Live Demo
                        </a>
                      )}
                      {project.links.github && (
                        <a href={project.links.github} target="_blank" rel="noreferrer" className="content-card__link">
                          Source Code
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel id="experience" eyebrow="Experience" title="Hands-on work across APIs, automation, reporting, and platform reliability." wide>
            <ExperienceDeck experiences={experienceCards} />
          </SectionPanel>

          <SectionPanel id="achievements" eyebrow={achievementsSection.eyebrow} title={achievementsSection.title} wide>
            <div className="card-grid">
              {achievementsSection.items.map((achievement) => (
                <article key={achievement.title} className="content-card">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel id="contact" eyebrow="Contact" title="Available for meaningful backend and product engineering work." wide>
            <div className="contact-grid">
              {contactCards.map((item) => (
                <a key={item.label} className="contact-card" href={item.href} target="_blank" rel="noreferrer">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </SectionPanel>
        </section>
      </main>
    </div>
  );
};

export default PortfolioPage;
