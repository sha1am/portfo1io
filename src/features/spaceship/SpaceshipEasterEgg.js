import React, { useCallback, useEffect, useRef, useState } from 'react';
import SpaceshipEngine from './engine';
import { CRACK_DURATION_MS, HATCH_DELAY_MS, STORAGE_KEY } from './constants';

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
  '#3ec8d4';

/**
 * Returns false on any visit where the toy would be unwelcome or pointless:
 * a visitor who already dismissed it, someone who asked for reduced motion,
 * a touch device (there is no cursor to chase), or a narrow screen.
 */
const shouldRun = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (window.localStorage.getItem(STORAGE_KEY) === 'dismissed') return false;
  } catch (error) {
    /* private mode - fall through and allow it */
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  if (window.innerWidth < 900) return false;

  return true;
};

const PHASES = { IDLE: 'idle', CRACKING: 'cracking', FLYING: 'flying', GONE: 'gone' };

const SpaceshipEasterEgg = () => {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [enabled, setEnabled] = useState(false);
  const [piloted, setPiloted] = useState(false);

  const canvasRef = useRef(null);
  const eggRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    setEnabled(shouldRun());
  }, []);

  const dismiss = useCallback(() => {
    engineRef.current?.destroy();
    engineRef.current = null;
    setPhase(PHASES.GONE);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch (error) {
      /* ignore */
    }
  }, []);

  // The egg sits quietly, then cracks.
  useEffect(() => {
    if (!enabled || phase !== PHASES.IDLE) return undefined;
    const timer = setTimeout(() => setPhase(PHASES.CRACKING), HATCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [enabled, phase]);

  // ...and once cracked, the ship comes out of wherever the egg was sitting.
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

  if (!enabled || phase === PHASES.GONE) return null;

  return (
    <>
      {(phase === PHASES.IDLE || phase === PHASES.CRACKING) && (
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
