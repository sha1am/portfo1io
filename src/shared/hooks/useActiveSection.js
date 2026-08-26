import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view so the nav can highlight it.
 *
 * Rule: the active section is the last one whose top edge has passed the
 * header line. Nothing is active while the hero is still in view, and at the
 * very bottom of the page the last section wins so short trailing sections
 * still get highlighted.
 */
export const useActiveSection = (sectionIds, offset = 96) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    let frame = null;

    const measure = () => {
      frame = null;

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (reachedBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top - offset <= 0
      );

      // Nothing highlighted while the hero is still in view.
      setActiveId(passed.length > 0 ? passed[passed.length - 1].id : null);
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
};
