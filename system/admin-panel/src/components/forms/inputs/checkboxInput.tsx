import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import React from 'react';

export type CheckboxInputProps = CheckboxProps & {
  label?: string;
};

export function CheckboxInput(props: CheckboxInputProps) {
  const { label, ...checkboxProps } = props;

  const input = (
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon style={{ width: '0.8em', height: '0.8em' }} />}
      checkedIcon={<CheckBoxIcon style={{ width: '0.8em', height: '0.8em' }} />}
      indeterminateIcon={<IndeterminateCheckBoxIcon style={{ width: '0.8em', height: '0.8em' }} />}
      {...checkboxProps}
    />
  );

  if (label) return (
    <FormControlLabel
      control={input}
      label={<p className="font-bold pb-1 pl-[2px] text-gray-700">{label}</p>}
    />
  )

  return input;
}