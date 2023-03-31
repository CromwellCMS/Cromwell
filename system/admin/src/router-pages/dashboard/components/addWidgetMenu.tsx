import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@hooks/useDashboard';
import React, { Fragment } from 'react';

export const AddWidgetMenu = () => {
  const { widgetList, addWidget } = useDashboard();

  return (
    <Menu as="div" className="text-left relative inline-block">
      <div>
        <Menu.Button className=" rounded-md font-medium text-sm w-full py-2 px-4 text-indigo-600 inline-flex justify-center hover:bg-indigo-100 focus:outline-none focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75">
          Add
          <ChevronDownIcon className="h-5 -mr-1 ml-2 text-violet-400 w-5 hover:text-violet-300" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="divide-y bg-white rounded-md divide-gray-100 shadow-lg ring-black mt-2 transform origin-top right-0 ring-1 ring-opacity-5 w-56 translate-x-1/2 absolute focus:outline-none">
          <div className="py-1 px-1 ">
            {widgetList.map((wdgt, idx) => (
              <Menu.Item key={idx}>
                <button
                  onClick={() => addWidget(wdgt.id)}
                  className={`text-gray-900 group hover:bg-indigo-200 flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  {wdgt.title}
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
