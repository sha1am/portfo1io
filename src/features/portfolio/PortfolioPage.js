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
  resumeCards,
  resumeAsset,
  skillsSection,
  socialLinks,
  stats,
} from './data/content';
import HeroSection from './components/HeroSection';
import ExperienceDeck from './components/ExperienceDeck';
import SectionPanel from './components/SectionPanel';
import SiteHeader from './components/SiteHeader';
import StatsStrip from './components/StatsStrip';

const PortfolioPage = () => (
  <div className="app-shell">
    <div className="app-background" />
    <SiteHeader navigationItems={navigationItems} />

    <main className="landing-page" id="top">
      <HeroSection
        heroContent={heroContent}
        socialLinks={socialLinks}
        resumeCards={resumeCards}
        resumeAsset={resumeAsset}
        codingProfiles={codingProfiles}
      />

      <div className="scroll-cue">Scroll Down</div>
      <StatsStrip items={stats} />

      <div className="portfolio-sections">
        <div className="portfolio-row portfolio-row--intro">
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
        </div>

        <SectionPanel id="experience" eyebrow="Experience" title="Hands-on work across APIs, automation, reporting, and platform reliability." wide>
          <ExperienceDeck experiences={experienceCards} />
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

        <div className="portfolio-row portfolio-row--credibility">
          <SectionPanel id="achievements" eyebrow={achievementsSection.eyebrow} title={achievementsSection.title}>
            <div className="card-grid card-grid--compact">
              {achievementsSection.items.map((achievement) => (
                <article key={achievement.title} className="content-card">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel id="contact" eyebrow="Contact" title="Available for meaningful backend and product engineering work.">
            <div className="contact-grid">
              {contactCards.map((item) => (
                <a key={item.label} className="contact-card" href={item.href} target="_blank" rel="noreferrer">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </SectionPanel>
        </div>
      </div>
    </main>
  </div>
);

export default PortfolioPage;
