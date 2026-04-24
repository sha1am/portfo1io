import React from 'react';

const ResumePreview = ({ className, resumeAsset }) => (
  <article className={`resume-page ${className}`}>
    <div className="resume-page__preview-shell">
      <iframe
        className="resume-page__preview-frame"
        src={resumeAsset.firstPagePreviewUrl}
        title="Resume page 1 preview from Google Drive"
        loading="lazy"
        allow="autoplay"
      />
    </div>
    <div className="resume-page__preview-actions">
      <a href={resumeAsset.viewUrl} target="_blank" rel="noreferrer">
        Open
      </a>
      <a href={resumeAsset.downloadUrl} target="_blank" rel="noreferrer">
        Download
      </a>
    </div>
  </article>
);

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
    <div className="stage-glow" />
    <div className="stage-rings" />
    {cards.map((card) => (
      card.type === 'preview' ? (
        <ResumePreview key={card.className} className={card.className} resumeAsset={resumeAsset} />
      ) : (
        <ResumeTextPage key={card.className} className={card.className} title={card.title} lines={card.lines} />
      )
    ))}

    <div className="stage-control">
      <span className="stage-control__icon">↻</span>
      <span>Resume page 1</span>
    </div>
    <div className="stage-arrows" aria-hidden="true">
      <span>‹</span>
      <span>›</span>
    </div>
  </div>
);

export default ResumeStage;
