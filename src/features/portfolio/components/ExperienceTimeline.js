import React from 'react';
import Icon from './Icon';

/**
 * A plain vertical timeline. Every card is fully readable without hovering,
 * so it works identically on touch, keyboard and screen readers.
 */
const ExperienceTimeline = ({ experiences }) => (
  <ol className="timeline">
    {experiences.map((experience, index) => (
      <li
        className="timeline__item"
        key={`${experience.company}-${experience.role}`}
        data-reveal
        style={{ '--reveal-delay': `${index * 90}ms` }}
      >
        <span className="timeline__marker" aria-hidden="true" />

        <article className="timeline__card">
          <header className="timeline__head">
            <div>
              <h3 className="timeline__role">{experience.role}</h3>
              <p className="timeline__company">{experience.company}</p>
            </div>
            <p className="timeline__range">
              <Icon name="calendar" />
              {experience.range}
            </p>
          </header>

          {experience.location && (
            <p className="timeline__location">
              <Icon name="pin" />
              {experience.location}
            </p>
          )}

          <ul className="timeline__points">
            {experience.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {experience.techStack && (
            <ul className="chip-row" aria-label="Technologies used">
              {experience.techStack.map((tech) => (
                <li key={tech} className="chip chip--tech">
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </article>
      </li>
    ))}
  </ol>
);

export default ExperienceTimeline;
