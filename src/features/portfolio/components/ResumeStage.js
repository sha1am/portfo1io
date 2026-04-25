import React, { useEffect, useRef, useState } from 'react';
import { RESUME } from '../../../shared/constants';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ResumePreview = ({ className, resumeAsset }) => {
  return (
    <article
      className={`resume-page ${className}`}
    >
      <div className="resume-page__sheet">
        <div className="resume-page__preview-shell">
          <img
            className="resume-page__preview-image"
            src={resumeAsset.firstPagePreviewUrl}
            alt="Resume page 1 preview"
            loading="lazy"
          />
        </div>
      </div>
    </article>
  );
};

const ResumeTextPage = ({ className, title, lines }) => (
  <article className={`resume-page ${className}`}>
    <div className="resume-page__header">
      <span className="resume-page__name">Shadab Alam</span>
      <span className="resume-page__meta">Backend Engineer | Go | Python</span>
    </div>
    <div className="resume-page__section">
      <span className="resume-page__section-title">{title}</span>
      {lines.map((line) => (
        <span key={line} className="resume-page__line">
          {line}
        </span>
      ))}
    </div>
    <div className="resume-page__section">
      <span className="resume-page__section-title">Highlights</span>
      <span className="resume-page__line">Designed APIs, pipelines, and internal tools.</span>
      <span className="resume-page__line">Focused on reliability, scale, and product impact.</span>
      <span className="resume-page__line">Worked across backend, infra, and delivery.</span>
    </div>
  </article>
);

const ResumeStage = ({ cards, resumeAsset }) => (
  <div className="hero-stage" id="resume-stage">
    <div className="stage-content">
      <div className="stage-podium" aria-hidden="true">
        <div className="stage-glow" />
        <div className="stage-rings" />
      </div>

      <div className="resume-container">
        {cards.map((card) => (
          card.type === 'preview' ? (
            <ResumePreview key={card.className} className={card.className} resumeAsset={resumeAsset} />
          ) : (
            <ResumeTextPage key={card.className} className={card.className} title={card.title} lines={card.lines} />
          )
        ))}
      </div>
    </div>

    <div className="stage-dock">
      <div className="stage-actions">
        <a className="primary-button" href={resumeAsset.viewUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5h.5Zm7 1.5v3h3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 12h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          View Resume
        </a>
        <a className="ghost-button" href="#contact">
          Get In Touch
        </a>
      </div>

          </div>
  </div>
);

export default ResumeStage;
