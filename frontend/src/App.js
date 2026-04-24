import React from 'react';
import portrait from './assets/images/newPP_r.png';
import './styles/App.css';

const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const stats = [
  {
    label: 'Experience',
    value: '2+ Years',
    icon: (
      <path d="M4 8.5h16M8 5.5h8M7 8.5v-3h10v3M6 8.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    ),
  },
  {
    label: 'Projects',
    value: '3+ Completed',
    icon: (
      <path d="m7 7-4 5 4 5M17 7l4 5-4 5M14 4l-4 16" />
    ),
  },
  {
    label: 'Problems Solved',
    value: '400+',
    icon: (
      <path d="M4 19V5M4 19h16M7.5 14l3-3 2.5 2.5L18 8" />
    ),
  },
  {
    label: 'Users Impacted',
    value: '2M+',
    icon: (
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" />
    ),
  },
];

const skills = [
  'Python',
  'Django',
  'DRF',
  'React',
  'JavaScript',
  'PostgreSQL',
  'Docker',
  'Redis',
  'Kafka',
  'AWS',
];

const projectCards = [
  {
    title: 'Resume-Driven Portfolio',
    tag: 'Frontend Experience',
    summary: 'A cinematic portfolio homepage with a floating resume stage, social links, and strong first-impression storytelling.',
  },
  {
    title: 'Data Platforms',
    tag: 'Backend Systems',
    summary: 'Scalable backend services for ingestion, document workflows, and operational tooling across production-grade systems.',
  },
  {
    title: 'Applied ML Workflows',
    tag: 'Intelligent Products',
    summary: 'Prediction and automation pipelines that tie product decisions to measurable impact, throughput, and reliability.',
  },
];

const experienceCards = [
  {
    range: '2024 - Present',
    role: 'Software Development Engineer',
    company: 'Building backend-heavy products',
    points: [
      'Designed APIs and async workflows for data-rich applications.',
      'Improved throughput and reliability on document and reporting pipelines.',
    ],
  },
  {
    range: '2023 - 2024',
    role: 'Python Developer',
    company: 'Shipping automation and analytics systems',
    points: [
      'Worked across Python, Django, SQL, and product-facing tooling.',
      'Took features from implementation to deployment with practical ownership.',
    ],
  },
];

const contactCards = [
  { label: 'Email', value: 'shadab.connect@gmail.com', href: 'mailto:shadab.connect@gmail.com' },
  { label: 'GitHub', value: 'github.com/sha1am', href: 'https://github.com/sha1am' },
  { label: 'LinkedIn', value: 'linkedin.com/in/sha1am', href: 'https://www.linkedin.com/in/sha1am/' },
];

const SocialIcon = ({ children, label, href }) => (
  <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  </a>
);

const StatIcon = ({ children }) => (
  <span className="stat-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </span>
);

const ResumePage = ({ className, title, lines }) => (
  <article className={`resume-page ${className}`}>
    <div className="resume-page__header">
      <span className="resume-page__name">Shadab Alam</span>
      <span className="resume-page__meta">Backend Engineer | Python | Django</span>
    </div>
    <div className="resume-page__section">
      <span className="resume-page__section-title">{title}</span>
      {lines.map((line) => (
        <span key={line} className="resume-page__line">
          {line}
        </span>
      ))}
    </div>
    <div className="resume-page__section">
      <span className="resume-page__section-title">Highlights</span>
      <span className="resume-page__line">Designed APIs, pipelines, and internal tools.</span>
      <span className="resume-page__line">Focused on reliability, scale, and product impact.</span>
      <span className="resume-page__line">Worked across backend, infra, and delivery.</span>
    </div>
  </article>
);

const App = () => {
  const scrollToResume = () => {
    document.getElementById('resume-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app-shell">
      <div className="app-background" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Go to top">
          <span className="brand-mark">SA</span>
          <span className="brand-name">Shadab Alam</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button className="theme-chip" type="button" aria-label="Theme preview">
          <span className="theme-chip__moon" />
        </button>
      </header>

      <main className="landing-page" id="top">
        <section className="hero-section">
          <aside className="social-rail" aria-label="Social links">
            <SocialIcon href="https://github.com/sha1am" label="GitHub">
              <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .08 1.52 1.04 1.52 1.04.88 1.55 2.31 1.11 2.87.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.8c.85 0 1.7.12 2.49.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/in/sha1am/" label="LinkedIn">
              <path d="M6.94 8.5A1.44 1.44 0 1 0 6.94 5.62a1.44 1.44 0 0 0 0 2.88ZM5.7 10.2h2.5v8.1H5.7v-8.1Zm4.05 0h2.4v1.1h.04c.33-.62 1.16-1.28 2.38-1.28 2.55 0 3.03 1.73 3.03 3.98v4.3h-2.5v-3.81c0-.91-.02-2.08-1.23-2.08-1.24 0-1.42.99-1.42 2.01v3.88h-2.5v-8.1Z" />
            </SocialIcon>
            <SocialIcon href="mailto:shadab.connect@gmail.com" label="Email">
              <path d="M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm0 1.2 8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </SocialIcon>
          </aside>

          <div className="hero-copy">
            <div className="portrait-frame">
              <div className="portrait-aura" />
              <img src={portrait} alt="Portrait of Shadab Alam" className="hero-portrait" />
            </div>

            <p className="eyebrow">Hello, I&apos;m</p>
            <h1>Shadab Alam</h1>
            <p className="hero-role">Software Development Engineer</p>
            <div className="hero-divider" />
            <p className="hero-summary">
              <span>Backend Developer</span>
              <span>Problem Solver</span>
              <span>Tech Enthusiast</span>
            </p>

            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={scrollToResume}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5h.5Zm7 1.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                View My Resume (3D)
              </button>
              <a className="ghost-button" href="#contact">
                Let&apos;s Build
              </a>
            </div>
          </div>

          <div className="hero-stage" id="resume-stage">
            <div className="stage-glow" />
            <div className="stage-rings" />
            <ResumePage
              className="resume-page--left"
              title="Professional Summary"
              lines={[
                'Backend-focused engineer with practical product sense.',
                'Builds APIs, workflows, and systems for scale.',
                'Strong bias for execution and clarity.',
              ]}
            />
            <ResumePage
              className="resume-page--center"
              title="Experience"
              lines={[
                'Designed backend services and document pipelines.',
                'Shipped features across Django, React, and infra.',
                'Improved throughput, reliability, and user impact.',
              ]}
            />
            <ResumePage
              className="resume-page--right"
              title="Projects"
              lines={[
                'Portfolio platform with immersive presentation.',
                'Internal tools and automation-heavy products.',
                'Applied ML and workflow optimization work.',
              ]}
            />

            <div className="stage-control">
              <span className="stage-control__icon">↻</span>
              <span>Drag to rotate</span>
            </div>
            <div className="stage-arrows" aria-hidden="true">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>
        </section>

        <div className="scroll-cue">Scroll Down</div>

        <section className="stats-strip" aria-label="Highlights">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <StatIcon>{stat.icon}</StatIcon>
              <div>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <section className="panel" id="about">
            <div className="section-heading">
              <span>About</span>
              <h2>Building polished products from backend logic to user-facing flow.</h2>
            </div>
            <p>
              This rebuild starts from a stronger foundation: a focused hero, better storytelling, clearer sections, and a deployment path that fits
              Vercel for the frontend and Render for the backend.
            </p>
            <p>
              The design direction follows the reference closely without cloning it outright. It keeps the dark cinematic tone, floating document stage,
              blue glow system, and a more intentional visual hierarchy.
            </p>
          </section>

          <section className="panel" id="skills">
            <div className="section-heading">
              <span>Skills</span>
              <h2>Core stack and delivery strengths.</h2>
            </div>
            <div className="chip-grid">
              {skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="panel panel--wide" id="projects">
            <div className="section-heading">
              <span>Projects</span>
              <h2>Selected work that balances engineering depth with product feel.</h2>
            </div>
            <div className="card-grid">
              {projectCards.map((project) => (
                <article key={project.title} className="content-card">
                  <p className="content-card__tag">{project.tag}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel panel--wide" id="experience">
            <div className="section-heading">
              <span>Experience</span>
              <h2>Hands-on work across APIs, automation, reporting, and platform reliability.</h2>
            </div>
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
          </section>

          <section className="panel panel--wide" id="contact">
            <div className="section-heading">
              <span>Contact</span>
              <h2>Available for meaningful backend and product engineering work.</h2>
            </div>
            <div className="contact-grid">
              {contactCards.map((item) => (
                <a key={item.label} className="contact-card" href={item.href} target="_blank" rel="noreferrer">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default App;
