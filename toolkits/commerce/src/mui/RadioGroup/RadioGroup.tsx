import { FormControl, FormControlLabel, Radio, RadioGroup as MuiRadioGroup } from '@mui/material';
import React from 'react';
import { TRadioProps } from '../../base/shared/Radio';

/** @internal */
export function RadioGroup(props: TRadioProps) {
  return (
    <FormControl component="fieldset"
      className={props.className}
      style={props.style}
      id={props.id}
    >
      <MuiRadioGroup
        value={props.value}
        onChange={props.onChange}
        name={props.name}
      >
        {props.options?.map(option => {
          const value = typeof option === 'object' ? option.value : option;
          if (!value) return <></>;
          const label = (typeof option === 'object' ? option.label : option) ?? value;
          return (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio color="primary" />}
              label={label}
            />
          )
        })}
      </MuiRadioGroup>
    </FormControl>
  )
}