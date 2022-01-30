import { IconButton, TextField, InputAdornment } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { AddIcon, RemoveIcon } from '../../base/icons';

import styles from './QuantityField.module.scss';

/** @internal */
export function QuantityField(props: {
  value: number;
  onChange: (value: number, event?: any) => any;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { value, onChange, className, style } = props;
  return (
    <TextField
      variant="outlined"
      size="small"
      className={clsx(styles.QuantityField, className)}
      style={style}
      value={value}
      onChange={(e) => {
        const val = parseInt(e.target.value);
        if (val && !isNaN(val) && val > 0) onChange(val, e)
      }}
      InputProps={{
        startAdornment: (<InputAdornment position="start" style={{ margin: 0 }}>
          <IconButton
            aria-label="Decrease amount"
            className={styles.controlButton}
            style={{ width: '44px' }}
            onClick={() => {
              if (value > 1) {
                onChange(value - 1)
              }
            }}
          ><RemoveIcon /></IconButton>
        </InputAdornment>),
        endAdornment: (<InputAdornment position="end" style={{ margin: 0 }}>
          <IconButton
            aria-label="Increase amount"
            className={styles.controlButton}
            style={{ width: '44px' }}
            onClick={() => {
              onChange(value + 1)
            }}
          ><AddIcon /></IconButton>
        </InputAdornment>),
      }}
    />
  )
}
