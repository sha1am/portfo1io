import React from 'react';
import {
  aboutSection,
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
import SectionPanel from './components/SectionPanel';
import SiteHeader from './components/SiteHeader';
import StatsStrip from './components/StatsStrip';

const PortfolioPage = () => {
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
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel id="experience" eyebrow="Experience" title="Hands-on work across APIs, automation, reporting, and platform reliability." wide>
            <div className="timeline">
              {experienceCards.map((item) => (
                <article key={`${item.range}-${item.role}`} className="timeline-card">
                  <p className="timeline-card__range">{item.range}</p>
                  <h3>{item.role}</h3>
                  <p className="timeline-card__company">{item.company}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
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
