import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { TextField, Box } from '@mui/material';
import React, { useState } from 'react';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';

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
    renderInput: (params) => <TextField
      variant="standard"
      fullWidth
      {...params}
    />,
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
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
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
