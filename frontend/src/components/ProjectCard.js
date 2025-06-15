import React from 'react';

const ProjectCard = ({ title, link }) => (
  <div className="project-card">
    <h2>{title}</h2>
    <a href={link} target="_blank" rel="noopener noreferrer">Visit</a>
  </div>
);

export default ProjectCard;
