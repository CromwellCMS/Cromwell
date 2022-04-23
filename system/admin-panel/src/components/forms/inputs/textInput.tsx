import React, { ForwardedRef, forwardRef } from "react";

type TextInputProps =
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
    label?: any;
    prefix?: any;
    overlay?: any;
    description?: any;
    error?: any;
  };

export const TextInputField = React.forwardRef(
  (
    props: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const {
      label,
      className,
      type,
      overlay,
      prefix,
      description,
      error,
      ...rest
    } = props;

    const inputClassName =
      type === "color"
        ? `border -p-1 pl-20 text-sm rounded-md focus:outline outline-indigo-500 ${error ? "border-red-500" : ""} disabled:bg-gray-200 shadow-md shadow-indigo-50 text-black active:text-indigo-600 w-full ${className}`
        : `border text-sm ${prefix ? "pl-7" : "pl-1"} rounded-md focus:outline ${error ? "border-red-500": ""} disabled:bg-gray-200 outline-indigo-500 shadow-md py-2 px-1 shadow-indigo-50 text-black active:text-indigo-600 w-full ${className}`;

    const inputField = (
      <div className="flex w-full relative">
        {prefix && (
          <div className="flex h-9 text-center p-1 top-0 left-0 w-9 items-center absolute">
            <div className="mx-auto">
              {prefix}
            </div>
          </div>
        )}
        <input
          ref={ref}
          className={inputClassName}
          type={type}
          {...rest}
        />
        {type === "color" && (
          <span className="text-white text-sm left-2 absolute self-center mix-blend-difference">
            {overlay ?? "#00000"}
          </span>
        )}
      </div>
    );

    return (
      <>
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
      </>
    );
  },
);
