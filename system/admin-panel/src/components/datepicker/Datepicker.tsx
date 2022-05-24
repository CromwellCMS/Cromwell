import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { TextField } from '@mui/material';
import React from 'react';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';

export type DatepickerProps = {
  value?: Date | null;
  rangeValue?: DateRange<Date> | null;
  onChange?: (date: Date | null) => void;
  onRangeChange?: (date: DateRange<Date>, keyboardInputValue?: string) => void;
  label?: string;
  dateType?: 'date' | 'datetime' | 'time';
  range?: boolean;
}

export function Datepicker({ label, dateType, value, onChange, range, rangeValue, onRangeChange }: DatepickerProps) {
  const commonProps = {
    label: label,
    value: value,
    onChange: (newValue: any) => {
      if (!newValue) {
        onChange(null);
        return;
      }
      const date = new Date(newValue);
      if (isNaN(date.getTime())) {
        onChange(null);
        return;
      }
      onChange(date);

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
      content = <DateRangePicker
        {...commonProps}
        value={rangeValue}
        onChange={onRangeChange}
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
