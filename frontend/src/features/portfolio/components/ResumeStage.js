import React, { useEffect, useRef, useState } from 'react';
import { RESUME } from '../../../shared/constants';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ResumePreview = ({ className, resumeAsset }) => {
  const [pose, setPose] = useState(RESUME.POSE.INITIAL);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragState = useRef(null);
  const resetTimer = useRef(null);
  const expandTimer = useRef(null);

  const clearExpandTimer = () => {
    if (expandTimer.current) {
      window.clearTimeout(expandTimer.current);
      expandTimer.current = null;
    }
  };

  const clearResetTimer = () => {
    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const resetPose = () => {
    clearResetTimer();
    setIsDragging(false);
    setPose(RESUME.POSE.INITIAL);
  };

  const scheduleReset = (delay = RESUME.POSE.RESET_DELAY) => {
    clearResetTimer();
    resetTimer.current = window.setTimeout(() => {
      setIsDragging(false);
      setPose(RESUME.POSE.INITIAL);
    }, delay);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('.resume-page__preview-actions')) {
      return;
    }

    event.preventDefault();
    clearResetTimer();
    setIsDragging(true);

    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPose: pose,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragState.current) {
      return;
    }

    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;

    setPose({
      rotateX: clamp(dragState.current.startPose.rotateX - dy / 18, -24, 16),
      rotateY: clamp(dragState.current.startPose.rotateY + dx / 14, -42, 20),
      rotateZ: clamp(dragState.current.startPose.rotateZ + dx / 120, -6, 6),
      shiftX: clamp(dx / 2.2, -38, 38),
      shiftY: clamp(dy / 3.5, -26, 26),
    });
  };

  const handlePointerUp = (event) => {
    if (!dragState.current) {
      return;
    }

    dragState.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    scheduleReset();
  };

  const handleMouseEnter = () => {
    clearExpandTimer();
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    expandTimer.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  useEffect(() => () => {
    clearResetTimer();
    clearExpandTimer();
  }, []);

  return (
    <article
      className={`resume-page ${className} resume-page--interactive${isDragging ? ' is-dragging' : ''}${isExpanded ? ' is-expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--page-rotate-x': `${pose.rotateX}deg`,
        '--page-rotate-y': `${pose.rotateY}deg`,
        '--page-rotate-z': `${pose.rotateZ}deg`,
        '--page-shift-x': `${pose.shiftX}px`,
        '--page-shift-y': `${pose.shiftY}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="resume-page__sheet">
        <div className="resume-page__preview-shell">
          <iframe
            className={`resume-page__preview-frame${isExpanded ? ' is-interactive' : ''}`}
            src={resumeAsset.firstPagePreviewUrl}
            title="Resume page 1 preview from Google Drive"
            loading="lazy"
            allow="autoplay"
          />
        </div>
      </div>
      <div className="resume-page__preview-actions">
        <button type="button" onClick={resetPose}>
          Reset
        </button>
        <a href={resumeAsset.viewUrl} target="_blank" rel="noreferrer">
          Open
        </a>
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
      <span>Drag to inspect</span>
    </div>
    <div className="stage-arrows" aria-hidden="true">
      <span>‹</span>
      <span>›</span>
    </div>
  </div>
);

export default ResumeStage;
