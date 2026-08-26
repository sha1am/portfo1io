import React from 'react';

const resumeSections = [
  {
    title: 'Experience',
    lines: [
      'Software Engineer · Trademo',
      'SDE-1 Backend · Park+',
      'Python Developer · Viveja IT Services',
    ],
  },
  {
    title: 'Core Systems',
    lines: ['ACL and user management', 'Kafka notification services', 'Document screening pipelines'],
  },
  {
    title: 'Stack',
    lines: ['Go · Python · Kafka · REST', 'PostgreSQL · MySQL · Docker', 'Kubernetes · AWS · Django'],
  },
];

const Resume3D = ({ resumeUrl }) => (
  <a className="resume-stage" href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Open resume">
    <span className="resume-podium" aria-hidden="true" />
    <article className="resume-sheet">
      <header>
        <h2>Shadab Alam</h2>
        <p>Backend Engineer · Go · Python</p>
      </header>
      <div className="resume-scroll">
        {resumeSections.map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        ))}
      </div>
      <span className="resume-hint">Hover to magnify · Click to open</span>
    </article>
  </a>
);

export default Resume3D;
