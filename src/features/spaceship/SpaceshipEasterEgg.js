import React, { useCallback, useEffect, useRef, useState } from 'react';
import SpaceshipEngine from './engine';
import { CRACK_DURATION_MS, HATCH_DELAY_MS, HATCH_EVENT } from './constants';
import { canRunSpaceship, isSnoozed, snooze } from './availability';

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
  '#3ec8d4';

const PHASES = { DORMANT: 'dormant', WAITING: 'waiting', CRACKING: 'cracking', FLYING: 'flying' };

const SpaceshipEasterEgg = () => {
  const [phase, setPhase] = useState(PHASES.DORMANT);
  const [available, setAvailable] = useState(false);
  const [piloted, setPiloted] = useState(false);

  const canvasRef = useRef(null);
  const eggRef = useRef(null);
  const engineRef = useRef(null);

  // On a normal visit the egg appears and hatches by itself. If the visitor
  // recently dismissed it, it stays dormant until they ask for it.
  useEffect(() => {
    const runnable = canRunSpaceship();
    setAvailable(runnable);
    if (runnable && !isSnoozed()) setPhase(PHASES.WAITING);
  }, []);

  // The footer trigger hatches immediately, from any state, snooze or not.
  useEffect(() => {
    const onHatch = () => {
      setPhase((current) => (current === PHASES.FLYING ? current : PHASES.CRACKING));
    };
    window.addEventListener(HATCH_EVENT, onHatch);
    return () => window.removeEventListener(HATCH_EVENT, onHatch);
  }, []);

  const dismiss = useCallback(() => {
    engineRef.current?.destroy();
    engineRef.current = null;
    setPiloted(false);
    setPhase(PHASES.DORMANT);
    snooze();
  }, []);

  useEffect(() => {
    if (phase !== PHASES.WAITING) return undefined;
    const timer = setTimeout(() => setPhase(PHASES.CRACKING), HATCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== PHASES.CRACKING) return undefined;
    const timer = setTimeout(() => setPhase(PHASES.FLYING), CRACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== PHASES.FLYING || !canvasRef.current) return undefined;

    const origin = eggRef.current?.getBoundingClientRect();
    const engine = new SpaceshipEngine({
      canvas: canvasRef.current,
      accent: readAccent(),
      onModeChange: setPiloted,
    });

    engine.start(
      origin ? origin.left + origin.width / 2 : undefined,
      origin ? origin.top + origin.height / 2 : undefined
    );
    engineRef.current = engine;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      engine.destroy();
      engineRef.current = null;
    };
  }, [phase, dismiss]);

  if (!available || phase === PHASES.DORMANT) return null;

  return (
    <>
      {(phase === PHASES.WAITING || phase === PHASES.CRACKING) && (
        <div
          ref={eggRef}
          className={`egg${phase === PHASES.CRACKING ? ' is-cracking' : ''}`}
          aria-hidden="true"
        >
          <span className="egg__shell" />
          <span className="egg__crack" />
        </div>
      )}

      {phase === PHASES.FLYING && (
        <>
          <canvas ref={canvasRef} className="spaceship-canvas" aria-hidden="true" />
          <div className="spaceship-hud" role="status">
            <span className="spaceship-hud__keys">
              {piloted ? (
                <>
                  <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> fly
                  <span className="spaceship-hud__sep" />
                  <kbd>Space</kbd> fire
                </>
              ) : (
                <>
                  <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to take control
                </>
              )}
            </span>
            <button type="button" className="spaceship-hud__close" onClick={dismiss}>
              <kbd>Esc</kbd> dismiss
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SpaceshipEasterEgg;
