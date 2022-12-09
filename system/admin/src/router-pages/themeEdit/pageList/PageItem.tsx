import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, PencilIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';

import { useThemeEditor } from '../hooks/useThemeEditor';
import { TExtendedPageInfo } from '../ThemeEdit';

export const PageItem = ({
  page,
  onOpenPage,
}: {
  page: TExtendedPageInfo;
  onOpenPage: (page: TExtendedPageInfo) => Promise<any>;
}) => {
  const { editingPageConfig } = useThemeEditor();
  const activePage = editingPageConfig;
  const active = activePage && page && activePage.route === page.route && activePage.id === page.id;
  const isGeneric = page.route && (page.route.endsWith('[slug]') || page.route.endsWith('[id]'));

  return (
    <li
      key={page.id}
      className={`text-xs w-full cursor-pointer hover:text-indigo-500 bg-gradient-to-r border-r-4 hover:border-indigo-300 ${
        active
          ? 'from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-indigo-800 hover:bg-gradient-to-r hover:border-r-4 hover:border-indigo-300'
          : ''
      }`}
    >
      <div className="flex flex-row justify-between">
        <span className={`w-full h-full py-2 px-4 ${active ? 'font-bold' : ''}`} onClick={() => onOpenPage(page)}>
          {isGeneric && <RectangleStackIcon className="h-4 mr-3 text-gray-600 w-4 inline-block" />}
          {page.name}
        </span>
        <Menu as="div" className="text-left relative inline-block">
          <div>
            <Menu.Button className="rounded-md text-white w-full py-2 px-4 inline-flex justify-center focus:outline-none focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75">
              <EllipsisVerticalIcon className="h-4 text-gray-600 w-4 hover:text-indigo-600" aria-hidden="true" />
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
            <Menu.Items className="divide-y bg-white rounded-md divide-gray-100 shadow-lg ring-black mt-2 origin-top-right right-0 ring-1 ring-opacity-5 w-32 z-[300] absolute focus:outline-none">
              <div className="py-1 px-1 ">
                <Menu.Item>
                  <button
                    className={`text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100`}
                  >
                    <PencilIcon className="h-5 mr-2 w-5" aria-hidden="true" /> Edit
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
};
