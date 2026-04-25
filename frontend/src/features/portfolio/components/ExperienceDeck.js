import React, { useState } from 'react';

const getCardState = (index, activeIndex) => {
  if (activeIndex === null) {
    return 'is-resting';
  }

  const distance = Math.abs(index - activeIndex);

  if (distance === 0) {
    return 'is-active';
  }

  if (distance === 1) {
    return 'is-adjacent';
  }

  return 'is-muted';
};

const ExperienceDeck = ({ experiences }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div
      className={`timeline experience-deck${activeIndex !== null ? ' has-active-card' : ''}`}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div className="experience-deck__container">
        {experiences.map((experience, index) => (
          <article
            key={`${experience.range}-${experience.role}-${index}`}
            className={`experience-card ${getCardState(index, activeIndex)}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            tabIndex={0}
          >
            <div className="experience-card__content">
              <p className="timeline-card__range">{experience.range}</p>
              <h3>{experience.role}</h3>
              <p className="timeline-card__company">{experience.company}</p>
              {experience.location && <p className="timeline-card__location">{experience.location}</p>}

              <ul>
                {experience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              {experience.techStack && (
                <div className="timeline-card__tech-stack">
                  {experience.techStack.map((tech) => (
                    <span key={tech} className="tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ExperienceDeck;
