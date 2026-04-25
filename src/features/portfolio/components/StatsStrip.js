import React from 'react';

const statIcons = {
  briefcase: <path d="M4 8.5h16M8 5.5h8M7 8.5v-3h10v3M6 8.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />,
  code: <path d="m7 7-4 5 4 5M17 7l4 5-4 5M14 4l-4 16" />,
  chart: <path d="M4 19V5M4 19h16M7.5 14l3-3 2.5 2.5L18 8" />,
  users: <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" />,
};

const StatsStrip = ({ items }) => (
  <section className="stats-strip" aria-label="Highlights">
    {items.map((item) => (
      <article key={item.label} className="stat-card">
        <span className="stat-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {statIcons[item.icon]}
          </svg>
        </span>
        <div>
          <p>{item.label}</p>
          <strong>{item.value}</strong>
        </div>
      </article>
    ))}
  </section>
);

export default StatsStrip;
