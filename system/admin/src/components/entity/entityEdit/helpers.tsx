import useScrollTrigger from '@mui/material/useScrollTrigger';
import clsx from 'clsx';
import React from 'react';

import styles from './EntityEdit.module.scss';

export const setValueOfTextEditorField = (value?: string | null) => {
  let data: {
    html: string;
    json: any;
  } | null = null;
  try {
    if (value) {
      data = JSON.parse(value);
    }
  } catch (error) {
    console.error(error);
  }
  return {
    description: data?.html || null,
    descriptionDelta: data?.json ? JSON.stringify(data?.json) : data?.json || null,
  };
};

export const getInitialValueOfTextEditorField = (value: any, entityData: any) =>
  JSON.stringify({
    html: entityData.description,
    json: entityData.descriptionDelta ? JSON.parse(entityData.descriptionDelta) : undefined,
  });

export function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: document.getElementById('main-scroll-container'),
  });

  const bgStyle = 'bg-gray-100 bg-opacity-60 w-fudropll back-filter backdrop-blur-lg';

  return React.cloneElement(props.children, {
    className: trigger ? clsx(styles.header, styles.headerElevated, bgStyle) : clsx(styles.header, bgStyle),
  });
}
