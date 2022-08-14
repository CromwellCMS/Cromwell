import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { Box } from '@mui/material';
import React, { useState } from 'react';

import { TextInput } from './TextInput';

export type DatepickerProps = {
  value?: Date | DateRange<Date> | null;
  defaultValue?: Date | DateRange<Date> | null;
  onChange?: (date: Date | DateRange<Date> | null) => void;
  label?: string;
  dateType?: 'date' | 'datetime' | 'time';
  range?: boolean;
}

export function Datepicker({ label, dateType, value, onChange, range, defaultValue }: DatepickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onChange(newValue);
  }

  const commonProps = {
    label: label,
    value: value ?? internalValue,
    onChange: (newValue: any) => {
      if (!newValue) {
        handleChange(null);
        return;
      }
      if (Array.isArray(newValue)) {
        handleChange(newValue);
        return;
      }

      const date = new Date(newValue);
      if (isNaN(date.getTime())) {
        handleChange(null);
        return;
      }
      handleChange(date);
    },
    renderInput: (params) => {
      return (
        <div ref={params.ref}>
          <TextInput {...params} {...params.inputProps} {...params.InputProps} ref={params.inputRef}
            endAdornment={<Box sx={{
              '> div': {
                height: 'auto',
                top: '4px',
                position: 'relative',
                left: '-5px',
              }
            }}>{params.InputProps.endAdornment}</Box>} />
        </div>
      )
    },
  }

  let content;

  if (dateType === 'datetime') {
    content = <DateTimePicker {...commonProps} />
  } else if (dateType === 'time') {
    content = <TimePicker {...commonProps} />
  } else {
    if (range) {
      let v = (value ?? internalValue) as DateRange<Date>;
      if (v.length !== 2) {
        v = [new Date(), new Date()]
      }
      content = <DateRangePicker
        {...commonProps}
        renderInput={(startProps, endProps) => {
          return (
            <React.Fragment>
              <TextInput {...startProps.inputProps} {...(startProps as any)} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextInput {...endProps.inputProps} {...(endProps as any)} />
            </React.Fragment>
          )
        }}
        value={v}
      />
    } else {
      content = <DatePicker {...commonProps} />
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {content}
    </LocalizationProvider>
  )
}
