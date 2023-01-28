import useScrollTrigger from '@mui/material/useScrollTrigger';
import clsx from 'clsx';
import React from 'react';

import styles from '../EntityEdit.module.scss';

export function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: document.getElementById('main-scroll-container') || document.body,
  });

  const bgStyle = 'bg-gray-100 bg-opacity-60 w-fudropll back-filter backdrop-blur-lg';

  return React.cloneElement(props.children, {
    className: trigger
      ? clsx(styles.header, styles.elevationScroll, styles.headerElevated, bgStyle)
      : clsx(styles.header, styles.elevationScroll, bgStyle),
  });
}
