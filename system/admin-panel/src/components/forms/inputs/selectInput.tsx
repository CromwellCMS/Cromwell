import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export type SelectInputProps<T> = {
  value?: T;
  onChange?: (value: T) => any;
  options?: T[];
  getLabel?: (value: T) => any;
  getValue?: (value: T) => any;
  className?: string;
  disabled?: boolean;
}

export const SelectInputField = <T extends unknown>({
  value = null,
  onChange = (_) => {},
  options = [],
  className = "",
  disabled = false,
  getLabel = (val) => (val as string),
  getValue = (val) => val,
}: SelectInputProps<T>) => {
  return (
    <Listbox disabled={disabled} value={getValue(value)} onChange={onChange}>
        <div className="relative">
          <Listbox.Button disabled={disabled} className={`bg-white disabled:bg-gray-100 border rounded-md cursor-default shadow-md text-left w-full py-2 pr-10 pl-3 relative sm:text-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-indigo-300 focus-visible:ring-offset-2 ${className??""}`}>
            <span className="block truncate">{getLabel(value) ?? "-"}</span>
            <span className="flex pr-2 inset-y-0 right-0 absolute items-center pointer-events-none">
              <SelectorIcon
                className="h-5 text-gray-400 w-5"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="bg-white rounded-md shadow-lg ring-black mt-1 text-xs w-full max-h-60 py-1 ring-1 ring-opacity-5 z-[100] absolute overflow-auto sm:text-sm focus:outline-none">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'
                    }`
                  }
                  value={getValue(option)}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {getLabel(option)}
                      </span>
                      {selected ? (
                        <span className="flex pl-3 inset-y-0 left-0 text-indigo-600 absolute items-center">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
  )
}