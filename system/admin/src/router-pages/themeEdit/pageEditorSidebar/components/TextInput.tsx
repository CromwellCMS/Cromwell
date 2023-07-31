import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  label?: string;
  prefixElement?: any;
  // resetField: any;
  name?: string;
};

export const TextInput = ({
  label,
  prefixElement,
  // resetField,
  value = '',
  ...rest
}: InputProps) => {
  return (
    <div className="mt-3">
      <label className="text-xs" htmlFor={rest.name}>
        <span className="font-bold text-xs block">{label}</span>
        <div className="border rounded-md border-indigo-600 border-opacity-0 w-full group relative hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
          <div className="top-1 left-1 text-gray-400 select-none absolute inline-block">{prefixElement}</div>
          <input
            value={value}
            {...rest}
            className="border-b outline-none border-gray-200 text-left w-full py-1 pr-1 pl-6 inline-block appearance-none"
          />
          {/* <XCircleIcon
            onClick={resetField}
            width="16px"
            height="16px"
            className="text-white ml-1 inline-block group-hover:text-gray-400"
          /> */}
        </div>
      </label>
    </div>
  );
};

type TextAreaProps = React.ComponentProps<'textarea'> & {
  label?: string;
  prefixElement?: any;
  // resetField: any;
  name?: string;
};

export const TextAreaInput = ({
  label,
  prefixElement,
  // resetField,
  ...rest
}: TextAreaProps) => {
  return (
    <div className="mt-3">
      <label className="text-xs" htmlFor={rest.name}>
        <span className="font-bold text-xs block">{label}</span>
        <div className="border rounded-md border-indigo-600 border-opacity-0 w-full group relative hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
          <div className="top-1 left-1 text-gray-400 select-none absolute inline-block">{prefixElement}</div>
          <textarea
            {...rest}
            className="border-b outline-none border-gray-200 text-left w-full py-1 pr-1 pl-6 inline-block appearance-none"
          />
        </div>
      </label>
    </div>
  );
};
