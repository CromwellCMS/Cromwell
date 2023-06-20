import { Switch } from '@headlessui/react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';

export type SwitchInputProps = {
  value?: boolean;
  onChange?: (v: boolean) => any;
  label?: string | { active: string; inactive: string } | React.ReactNode;
  xs?: boolean;
  className?: string;
  sx?: SxProps;
};

export const SwitchInput = ({
  value = false,
  onChange = () => {},
  xs = false,
  className,
  sx,
  ...rest
}: SwitchInputProps) => {
  let displayLabel: any = rest.label;

  if (typeof displayLabel === 'object' && (displayLabel.active || displayLabel.inactive)) {
    if (value) {
      displayLabel = displayLabel.active;
    } else {
      displayLabel = displayLabel.inactive;
    }
  }

  return (
    <Switch.Group>
      <Box sx={sx} className={`flex items-center ${className ?? ''}`}>
        <Switch
          checked={value}
          onChange={onChange}
          className={`${value ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center ${
            xs ? 'h-3 w-6' : 'h-6 w-[2.75rem] min-w-[2.75rem]'
          } rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <span
            className={`${value ? (xs ? 'translate-x-3' : 'translate-x-6') : 'translate-x-1'} inline-block ${
              xs ? 'h-2 w-2' : 'w-4 h-4'
            } transform bg-white rounded-full transition-transform`}
          />
        </Switch>
        {displayLabel && <Switch.Label className={`${xs ? 'ml-1' : 'ml-4'}`}>{displayLabel}</Switch.Label>}
      </Box>
    </Switch.Group>
  );
};
