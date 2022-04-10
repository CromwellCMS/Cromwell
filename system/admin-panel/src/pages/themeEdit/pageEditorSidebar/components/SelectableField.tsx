import { Listbox, Menu, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline"
import { XCircleIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react"

export const SelectableField = ({
  value = "",
  onChange = () => {},
  options = [],
  top = false,
}: {
  value?: any,
  onChange?: any,
  top?: boolean,
  options?: { title?: string; value?: any }[],
}) => {
  return (
    <>
    <Menu as="div" className="w-[calc(100%-24px)] relative inline-block">
        <div className="w-full relative inline-block">
          <Menu.Button className="bg-white rounded-lg cursor-default text-left w-full py-2 pr-10 pl-3 inline-block relative sm:text-xs focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-indigo-300 focus-visible:ring-offset-2">
            <span className="block truncate">{value.title}</span>
            <span className="flex pr-2 inset-y-0 right-0 absolute items-center pointer-events-none">
              <SelectorIcon
                className="h-5 text-gray-400 w-5"
                aria-hidden="true"
              />
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className={`divide-y bg-white rounded-md divide-gray-100 shadow-lg ring-black mt-2 w-full  ${top ? "origin-bottom-right -translate-y-full" : "origin-top-right"} right-0 ring-1 ring-opacity-5 z-[100] absolute focus:outline-none`}>
              <div className="py-1 px-1">
              {options.map((opt, optIdx) => (
                <Menu.Item
                  key={optIdx}
                >
                  {({ active }) => (
                    <button
                    className={`${
                      active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                    } flex rounded-md items-center w-full px-2 py-2 text-xs`}
                    onClick={() => onChange(opt)}
                  >
                      <span
                        className={`block truncate ${
                          active ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {opt.title}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              ))}
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
        <XCircleIcon
              onClick={() => onChange({ value: "" })}
              width="16px"
              height="16px"
              className="mt-[-2px] mr-[2px] text-white ml-1 inline-block group-hover:text-gray-400" />
    </>
  )
}