import React from 'react';

import { throbber } from '../throbber';
import styles from './LoadBox.module.scss';

interface LoadBoxProps {
  size?: number;
  absolute?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadBox = (props: LoadBoxProps) => {
  const size = props.size ?? 150;
  return (
    <div
      className={`${styles.LoadBox} ${props.className}`}
      style={{ position: props.absolute ? 'absolute' : 'relative', ...(props.style ?? {}) }}
    >
      <div style={{ width: size + 'px', height: size + 'px' }} dangerouslySetInnerHTML={{ __html: throbber }}></div>
    </div>
  );
};
