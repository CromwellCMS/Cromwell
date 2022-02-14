import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from '@mui/material';
import React from 'react';

import { TSelectProps } from '../../base/shared/Select';

/** @internal */
export function Select(props: TSelectProps & MuiSelectProps<string | number>) {
  const { className, style, variant = 'filled' } = props;
  return (
    <FormControl
      fullWidth={props.fullWidth}
      style={props.style}
      className={props.className}
    >
      {props.label && (
        <InputLabel style={{
          marginTop: '8px',
        }}>{props.label}</InputLabel>
      )}
      <MuiSelect
        {...props}
        variant={variant}
        className={className}
        style={style}
      >
        {props.options?.map((option) => {
          const label = typeof option === 'object' ? option.label : option;
          const value = typeof option === 'object' ? option.value : option;
          return (
            <MenuItem value={value} key={value + ''}>{label}</MenuItem>
          )
        })}
      </MuiSelect>
    </FormControl>
  )
}
