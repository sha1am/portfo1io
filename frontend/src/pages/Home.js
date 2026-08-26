import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Resume3D from '../components/Resume3D';
import ProjectCard from '../components/ProjectCard';
import profileImage from '../assets/images/newPP_r.png';

const resumeUrl = 'https://drive.google.com/file/d/18BKUMCl3JeyyVsl-oCXtR-06_udcEysw/view';

const stats = [
  { label: 'Production Experience', value: '3+ yrs' },
  { label: 'Problems Solved', value: '400+' },
  { label: 'Users Reached', value: '2M+' },
  { label: 'Throughput Improved', value: '2x' },
];

const skills = [
  'Go',
  'Python',
  'Kafka',
  'REST APIs',
  'PostgreSQL',
  'MySQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Django',
  'Redis',
  'System Design',
];

const projects = [
  {
    title: 'ByteVault',
    tag: 'Full-stack file platform',
    summary: 'Secure file-management product with deduplication, advanced search, query-cached React flows, and Django REST APIs.',
    link: 'https://byte-vault-fort.vercel.app/',
    source: 'https://github.com/sha1am/ByteVault',
  },
  {
    title: 'GreenWave',
    tag: 'Computer vision traffic routing',
    summary: 'Vehicle-aware signal routing prototype designed to reduce waiting time and improve traffic flow using live video streams.',
    link: 'https://github.com/sha1am/MajorProject2023',
  },
  {
    title: 'Portfolio Platform',
    tag: 'React + Go deployment-ready app',
    summary: 'Personal portfolio structured as a deployable product with theme systems, backend health APIs, and recruiter-focused storytelling.',
    link: resumeUrl,
  },
];

const experience = [
  {
    company: 'Trademo',
    role: 'Software Engineer',
    period: 'Nov 2025 - Present',
    points: [
      'Building backend infrastructure for global trade compliance workflows.',
      'Implemented ACL-driven access control for secure role and permission management.',
      'Designed document-screening services for high-volume LC processing workflows.',
    ],
  },
  {
    company: 'Park+',
    role: 'SDE-1 Backend',
    period: 'Nov 2024 - Present',
    points: [
      'Maintained core backend services for a large-scale car-owner platform.',
      'Built Golang and Kafka notification services for customer engagement delivery.',
      'Developed Python rule-engine workflows for help and support automation.',
    ],
  },
  {
    company: 'Viveja IT Services',
    role: 'Python Developer',
    period: 'Jun 2023 - Aug 2024',
    points: [
      'Built Django dashboards and reporting systems for account monitoring.',
      'Integrated ML models into production workflows using Docker and Airflow.',
      'Improved reliability and delivery quality through refactoring and operational support.',
    ],
  },
];

const contacts = [
  { label: 'GitHub', value: 'github.com/sha1am', href: 'https://github.com/sha1am' },
  { label: 'LinkedIn', value: 'linkedin.com/in/sha1am', href: 'https://www.linkedin.com/in/sha1am/' },
  { label: 'Email', value: 'shadab.connect17@gmail.com', href: 'mailto:shadab.connect17@gmail.com' },
];

const Home = () => (
  <div className="site-shell">
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <Header />

    <main>
      <section className="hero-section" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Backend engineer · Go · Python · distributed systems</p>
          <h1>Shadab Alam builds backend systems that stay reliable under pressure.</h1>
          <p className="hero-lede">
            I design APIs, event-driven workflows, reporting systems, and internal platforms with a bias for
            correctness, operability, and clean handoff to the next engineer.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={resumeUrl} target="_blank" rel="noreferrer">
              View Resume
            </a>
            <a className="button button-secondary" href="#contact">
              Get In Touch
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Profile and resume preview">
          <div className="portrait-card">
            <img src={profileImage} alt="Portrait of Shadab Alam" />
          </div>
          <Resume3D resumeUrl={resumeUrl} />
        </div>
      </section>

      <section className="stats-grid" aria-label="Career highlights">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="section-grid" id="about">
        <div className="section-heading">
          <p className="eyebrow">Profile</p>
          <h2>Product-minded backend engineering with measurable execution.</h2>
        </div>
        <div className="panel">
          <p>
            My best work sits where product pressure meets systems complexity: access control, document workflows,
            support automation, notifications, and reporting pipelines. I care about making systems fast enough,
            observable enough, and simple enough to extend.
          </p>
        </div>
      </section>

      <section className="section-stack" id="skills">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>Core stack used across production services.</h2>
        </div>
        <div className="skill-cloud">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="section-stack" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Selected Projects</p>
          <h2>Work that demonstrates product sense and engineering range.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className="section-stack" id="experience">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Backend ownership across APIs, automation, and platform reliability.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="experience-card" key={`${item.company}-${item.role}`}>
              <div>
                <span>{item.period}</span>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Open to backend, platform, and product engineering roles.</h2>
        </div>
        <div className="contact-links">
          {contacts.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Home;
