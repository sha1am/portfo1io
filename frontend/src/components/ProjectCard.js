import React from 'react';

const ProjectCard = ({ title, tag, summary, link, source }) => (
  <article className="project-card">
    <span>{tag}</span>
    <h3>{title}</h3>
    <p>{summary}</p>
    <div className="project-links">
      {link && (
        <a href={link} target="_blank" rel="noreferrer">
          Open
        </a>
      )}
      {source && (
        <a href={source} target="_blank" rel="noreferrer">
          Source
        </a>
      )}
    </div>
  </article>
);

export default ProjectCard;
