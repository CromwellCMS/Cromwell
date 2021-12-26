import { IconButton, Input } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import styles from './QuantityField.module.scss';

export function QuantityField(props: {
  value: number;
  onChange: (value: number, event?: any) => any;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { value, onChange, className, style } = props;
  return (
    <Input
      className={clsx(styles.QuantityField, className)}
      style={style}
      value={value}
      onChange={(e) => {
        const val = parseInt(e.target.value);
        if (val && !isNaN(val) && val > 0) onChange(val, e)
      }}
      startAdornment={<div>
        <IconButton
          aria-label="Decrease amount"
          className={styles.controlButton}
          style={{ width: '44px' }}
          onClick={() => {
            if (value > 1) {
              onChange(value - 1)
            }
          }}
        ><span>-</span></IconButton>
      </div>}
      endAdornment={<div>
        <IconButton
          aria-label="Increase amount"
          className={styles.controlButton}
          style={{ width: '44px' }}
          onClick={() => {
            onChange(value + 1)
          }}
        ><span>+</span></IconButton>
      </div>}
    />
  )
}
