import { Box, GlobalStyles } from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useRef } from 'react';
import { DatePicker, DateRangePicker, DateRangePickerProps } from 'rsuite';
import { getGlobalStyles } from './styles';

import styles from './DateInput.module.scss';

export type DateInputType = 'date' | 'datetime' | 'time' | 'date_range' | 'date_time_range';

export type DateInputProps = {
  value?: Date | [Date, Date] | null;
  defaultValue?: Date | [Date, Date] | null;
  onChange?: (date: Date | [Date, Date] | null) => void;
  label?: string;
  dateType?: DateInputType;
  className?: string;
  format?: string;
  description?: any;
  error?: any;
  placement?: DateRangePickerProps['placement'];
  disabledDate?: DateRangePickerProps['disabledDate'];
};

export function DateInput(props: DateInputProps) {
  const {
    dateType = 'date',
    value,
    defaultValue = new Date(),
    className,
    label,
    description,
    error,
    placement,
    disabledDate,
  } = props;
  let { format } = props;

  const containerRef = useRef<HTMLDivElement>();
  const [internalValue, setInternalValue] = useState(defaultValue);

  const onCommonChange = (newValue) => {
    if (!value) {
      setInternalValue(newValue);
    }
    props.onChange?.(newValue);
  };

  const handleChange = (newValue: any) => {
    if (!newValue) {
      onCommonChange(null);
      return;
    }
    if (Array.isArray(newValue)) {
      onCommonChange(newValue);
      return;
    }

    const date = new Date(newValue);
    if (isNaN(date.getTime())) {
      onCommonChange(null);
      return;
    }
    onCommonChange(date);
  };

  let content;

  if (dateType === 'date_range' || dateType === 'date_time_range') {
    let dateRangeValue = (value ?? internalValue) as [Date, Date];
    if (dateRangeValue?.length !== 2) {
      dateRangeValue = [new Date(), new Date()];
    } else {
      dateRangeValue = dateRangeValue.map((d) => new Date(d)) as [Date, Date];
    }

    if (!format) {
      if (dateType === 'date_range') {
        format = 'yyyy-MM-dd';
      }
      if (dateType === 'date_time_range') {
        format = 'yyyy-MM-dd HH:mm:ss';
      }
    }

    content = (
      <DateRangePicker
        container={() => containerRef.current}
        format={format}
        value={dateRangeValue}
        placement={placement}
        onChange={handleChange}
        disabledDate={disabledDate}
      />
    );
  } else {
    if (!format) {
      if (dateType === 'date') {
        format = 'yyyy-MM-dd';
      }
      if (dateType === 'datetime') {
        format = 'yyyy-MM-dd HH:mm:ss';
      }
      if (dateType === 'time') {
        format = 'HH:mm:ss';
      }
    }

    content = (
      <DatePicker
        value={new Date((value ?? internalValue) as Date | null)}
        format={format}
        container={() => containerRef.current}
        onChange={handleChange}
        placement={placement}
        disabledDate={disabledDate}
      />
    );
  }

  if (label) {
    content = (
      <label className="w-full group active:text-indigo-500">
        <p className="font-bold pb-1 pl-[2px] text-gray-700">{label}</p>
        {content}
        <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {!error && description}
          {error ? error : ''}
        </p>
      </label>
    );
  }

  return (
    <Box className={clsx(className, styles.DateInput, 'RsuiteDateRangePicker')} ref={containerRef}>
      <GlobalStyles styles={getGlobalStyles()} />
      {content}
    </Box>
  );
}
