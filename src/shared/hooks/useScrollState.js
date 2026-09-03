import { useEffect, useState } from 'react';

/**
 * Returns how far the page is scrolled (0-1) and whether the user has
 * scrolled past `threshold`. Updates are batched into animation frames so
 * scrolling stays smooth.
 */
export const useScrollState = (threshold = 24) => {
  const [state, setState] = useState({ progress: 0, isScrolled: false });

  useEffect(() => {
    let frame = null;
    let isMounted = true;

    const measure = () => {
      if (!isMounted) return;
      frame = null;
      const scrollTop = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setState({
        progress: scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0,
        isScrolled: scrollTop > threshold,
      });
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      isMounted = false;
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return state;
};
