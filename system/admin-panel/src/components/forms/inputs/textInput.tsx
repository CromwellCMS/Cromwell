import clsx from "clsx";
import React, { ForwardedRef } from "react";

export interface InputBaseComponentProps
  extends React.HTMLAttributes<HTMLInputElement> {
  // Accommodate arbitrary additional props coming from the `inputProps` prop
  [arbitrary: string]: any;
}

export type TextInputProps =
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
    label?: any;
    prefix?: any;
    overlay?: any;
    description?: any;
    error?: any;
    inputComponent?: React.ElementType<InputBaseComponentProps>;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    rootClassName?: string;
    inputFieldClassName?: string;
    inputElementClassName?: string;
  };

export const TextInputField = React.forwardRef(
  (
    props: TextInputProps,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      label,
      className,
      rootClassName,
      inputFieldClassName,
      inputElementClassName,
      type,
      overlay,
      prefix,
      description,
      error,
      inputComponent = 'input',
      endAdornment,
      startAdornment,
      style,
      onChange,
      ...rest
    } = props;

    const InputComponent: React.ElementType<any> = inputComponent || 'input';

    const inputClassName =
      type === "color"
        ? `border -p-1 pl-20 text-sm rounded-md focus:outline outline-indigo-500 ${error ? "border-red-500" : ""} disabled:bg-gray-200 shadow-md shadow-indigo-50 text-black active:text-indigo-600 w-full ${inputElementClassName}`
        : `border text-sm ${prefix ? "pl-7" : "pl-1"} rounded-md focus:outline ${error ? "border-red-500" : ""} disabled:bg-gray-200 outline-indigo-500 shadow-md py-2 px-1 shadow-indigo-50 text-black active:text-indigo-600 w-full ${inputElementClassName}`;

    const inputField = (
      <div className={clsx(inputFieldClassName, "flex w-full relative")}>
        {prefix && (
          <div className="flex h-9 text-center p-1 top-0 left-0 w-9 items-center absolute">
            <div className="mx-auto">
              {prefix}
            </div>
          </div>
        )}
        {startAdornment}
        <InputComponent
          ref={ref}
          className={inputClassName}
          type={type}
          onChange={onChange}
          {...rest}
        />
        {endAdornment}
        {type === "color" && (
          <span className="text-white text-sm left-2 absolute self-center mix-blend-difference">
            {overlay ?? "#00000"}
          </span>
        )}
      </div>
    );

    return (
      <div style={style} className={clsx(rootClassName, className)}>
        {label && (
          <label className="w-full group active:text-indigo-500">
            <p className="font-bold pb-1 pl-[2px] text-gray-700">
              {label}
            </p>
            {inputField}
            <p className={`text-xs ${error ? "text-red-500" : "text-gray-400 group-hover:text-gray-600"}`}>
              {!error && description}
              {error ? error : ""}
            </p>
          </label>
        )}
        {!label && inputField}
      </div>
    );
  },
);
