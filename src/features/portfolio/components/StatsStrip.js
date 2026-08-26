import React from 'react';
import Icon from './Icon';

const StatsStrip = ({ items }) => (
  <section className="stats" aria-label="Career highlights">
    <div className="stats__grid">
      {items.map((item, index) => (
        <article
          className="stat"
          key={item.label}
          data-reveal
          style={{ '--reveal-delay': `${index * 70}ms` }}
        >
          <span className="stat__icon" aria-hidden="true">
            <Icon name={item.icon} />
          </span>
          <strong className="stat__value">{item.value}</strong>
          <p className="stat__label">{item.label}</p>
        </article>
      ))}
    </div>
  </section>
);

export default StatsStrip;
