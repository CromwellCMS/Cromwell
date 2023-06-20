import { NumberFormatCustom } from '@helpers/NumberFormatCustom';
import { Box, SxProps } from '@mui/material';
import clsx from 'clsx';
import React, { ForwardedRef, useState } from 'react';

export interface InputBaseComponentProps extends React.HTMLAttributes<HTMLInputElement> {
  // Accommodate arbitrary additional props coming from the `inputProps` prop
  [arbitrary: string]: any;
}

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  label?: string | JSX.Element;
  palceholder?: string;
  prefix?: any;
  overlay?: any;
  description?: any;
  error?: React.ReactNode;
  fixedHeight?: boolean;
  baseSize?: 'small' | 'medium' | 'large';
  inputComponent?: React.ElementType<InputBaseComponentProps>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  rootClassName?: string;
  inputFieldClassName?: string;
  inputElementClassName?: string;
  defaultValue?: string | number | readonly string[];
  sx?: SxProps;
};

export const TextInput = React.forwardRef(
  (props: TextInputProps, ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      label,
      className,
      value,
      defaultValue,
      rootClassName,
      inputFieldClassName,
      inputElementClassName,
      type,
      overlay,
      prefix,
      description,
      error,
      inputComponent,
      endAdornment,
      startAdornment,
      style,
      onChange,
      baseSize,
      sx,
      ...rest
    } = props;
    const [_value, setValue] = useState(defaultValue ?? '');

    const InputComponent: React.ElementType<any> =
      inputComponent || (type === 'currency' && NumberFormatCustom) || 'input';

    const sharedClasses =
      `border-2 rounded-lg outline outline-0 focus:outline-[2px] outline-indigo-500 ` +
      `text-black active:text-indigo-600 w-full ${inputElementClassName} ` +
      `disabled:bg-gray-200 shadow-md shadow-indigo-50 ${error ? 'border-red-500' : ''} ` +
      (baseSize === 'small' ? 'text-xs' : 'text-sm');

    const inputClassName =
      type === 'color'
        ? `-p-1 pl-20  ${sharedClasses}`
        : `${prefix ? 'pl-7' : 'pl-2'} px-2 ${sharedClasses} ` + (baseSize === 'small' ? 'py-1' : 'py-2');

    const inputField = (
      <div className={clsx(inputFieldClassName, 'flex w-full relative')}>
        {prefix && (
          <div className="flex h-9 text-center p-1 top-0 left-0 w-9 items-center absolute">
            <div className="mx-auto">{prefix}</div>
          </div>
        )}
        {startAdornment}
        <InputComponent
          ref={ref}
          className={inputClassName}
          type={type}
          onChange={(e) => {
            let value = e.target.value;
            if (type === 'number') value = Number(value);
            setValue(value);
            onChange(e);
          }}
          value={value ?? _value}
          {...rest}
        />
        {endAdornment}
        {type === 'color' && (
          <span className="text-white text-sm left-2 absolute self-center mix-blend-difference">
            {overlay ?? '#00000'}
          </span>
        )}
      </div>
    );

    return (
      <Box sx={sx} style={style} className={clsx(rootClassName, className)}>
        {label && (
          <label className="w-full group active:text-indigo-500">
            <p className="font-bold pb-1 pl-[2px] text-gray-700">{label}</p>
            {inputField}
            <p className={`text-xs mt-[3px] ${error ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
              {!error && description}
              {error ? error : ''}
            </p>
          </label>
        )}
        {!label && inputField}
      </Box>
    );
  },
);
