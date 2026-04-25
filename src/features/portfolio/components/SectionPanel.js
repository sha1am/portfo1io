import React from 'react';

const SectionPanel = ({ id, eyebrow, title, wide = false, children }) => (
  <section className={`panel${wide ? ' panel--wide' : ''}`} id={id}>
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
    {children}
  </section>
);

export default SectionPanel;
