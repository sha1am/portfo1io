import React from 'react';
import Icon from './Icon';
import { A11Y } from '../../../shared/constants';
import { useScrollState } from '../../../shared/hooks/useScrollState';

const BackToTop = () => {
  const { isScrolled } = useScrollState(600);

  return (
    <a
      className={`back-to-top${isScrolled ? ' is-visible' : ''}`}
      href="#top"
      aria-label={A11Y.LABELS.GO_TO_TOP}
      tabIndex={isScrolled ? 0 : -1}
    >
      <Icon name="arrowUp" />
    </a>
  );
};

export default BackToTop;
