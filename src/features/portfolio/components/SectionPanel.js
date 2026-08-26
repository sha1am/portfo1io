import React from 'react';

const SectionPanel = ({ id, eyebrow, title, description, children, className = '' }) => (
  <section className={`section ${className}`.trim()} id={id}>
    <header className="section__heading" data-reveal>
      <p className="section__eyebrow">
        <span className="section__eyebrow-dot" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="section__title">{title}</h2>
      {description && <p className="section__description">{description}</p>}
    </header>
    <div className="section__body" data-reveal>
      {children}
    </div>
  </section>
);

export default SectionPanel;
