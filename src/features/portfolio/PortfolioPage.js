import React from 'react';
import {
  aboutSection,
  achievementsSection,
  codingProfiles,
  contactCards,
  experienceCards,
  heroContent,
  navigationItems,
  projectCards,
  resumeAsset,
  skillsSection,
  socialLinks,
  stats,
} from './data/content';
import { A11Y } from '../../shared/constants';
import { useReveal } from '../../shared/hooks/useReveal';
import BackToTop from './components/BackToTop';
import ExperienceTimeline from './components/ExperienceTimeline';
import HeroSection from './components/HeroSection';
import Icon from './components/Icon';
import SectionPanel from './components/SectionPanel';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import StatsStrip from './components/StatsStrip';

const PortfolioPage = () => {
  useReveal();

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main">
        {A11Y.LABELS.SKIP_TO_CONTENT}
      </a>

      <div className="app-backdrop" aria-hidden="true" />

      <SiteHeader navigationItems={navigationItems} />

      <main className="main" id="main">
        <HeroSection
          heroContent={heroContent}
          socialLinks={socialLinks}
          resumeAsset={resumeAsset}
          codingProfiles={codingProfiles}
        />

        <StatsStrip items={stats} />

        <SectionPanel
          id="about"
          eyebrow={aboutSection.eyebrow}
          title={aboutSection.title}
        >
          <div className="prose">
            {aboutSection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          id="skills"
          eyebrow={skillsSection.eyebrow}
          title={skillsSection.title}
          description={skillsSection.description}
        >
          <div className="skill-groups">
            {skillsSection.groups.map((group) => (
              <div className="skill-group" key={group.name}>
                <h3 className="skill-group__name">{group.name}</h3>
                <ul className="chip-row">
                  {group.items.map((skill) => (
                    <li key={skill} className="chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          id="experience"
          eyebrow="Experience"
          title="Where I've built things"
          description="Hands-on work across APIs, automation, reporting, and platform reliability."
        >
          <ExperienceTimeline experiences={experienceCards} />
        </SectionPanel>

        <SectionPanel
          id="projects"
          eyebrow="Projects"
          title="Selected work"
          description="Projects that balance engineering depth with product feel."
        >
          <div className="card-grid">
            {projectCards.map((project, index) => (
              <article
                className="project-card"
                key={project.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` }}
              >
                <p className="project-card__tag">{project.tag}</p>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__summary">{project.summary}</p>

                {project.links && (
                  <div className="project-card__links">
                    {project.links.website && (
                      <a
                        href={project.links.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        Live demo
                        <Icon name="external" />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        Source
                        <Icon name="github" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          id="achievements"
          eyebrow={achievementsSection.eyebrow}
          title={achievementsSection.title}
        >
          <div className="card-grid card-grid--compact">
            {achievementsSection.items.map((achievement, index) => (
              <article
                className="achievement-card"
                key={achievement.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
              >
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          id="contact"
          eyebrow="Contact"
          title="Let's build something"
          description="Available for backend and product engineering work. The fastest way to reach me is email."
          className="section--contact"
        >
          <div className="contact-grid">
            {contactCards.map((item) => (
              <a
                key={item.label}
                className="contact-card"
                href={item.href}
                {...(item.external
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                <span className="contact-card__icon" aria-hidden="true">
                  <Icon name={item.icon} />
                </span>
                <span className="contact-card__body">
                  <span className="contact-card__label">{item.label}</span>
                  <strong className="contact-card__value">{item.value}</strong>
                </span>
                <Icon name="arrowRight" className="contact-card__arrow" />
              </a>
            ))}
          </div>
        </SectionPanel>
      </main>

      <SiteFooter socialLinks={socialLinks} navigationItems={navigationItems} />
      <BackToTop />
    </div>
  );
};

export default PortfolioPage;
