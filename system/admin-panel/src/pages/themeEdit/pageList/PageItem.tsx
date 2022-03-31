import React, { Fragment } from "react"
import { TExtendedPageInfo } from "../ThemeEdit";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  DotsVerticalIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { useThemeEditor } from "../hooks/useThemeEditor";

export const PageItem = ({
  page,
  onOpenPage,
}: {
  page: TExtendedPageInfo;
  onOpenPage: (page: TExtendedPageInfo) => Promise<any>;
}) => {
  const { editingPageConfig } = useThemeEditor();
  const activePage = editingPageConfig;
  const active =
    activePage &&
    page &&
    activePage.route === page.route &&
    activePage.id === page.id;

  return (
    <li
      key={page.id}
      className={`text-xs w-full cursor-pointer hover:text-indigo-500 bg-gradient-to-r border-r-4 hover:border-indigo-300 ${
        active ? "from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-indigo-800 hover:bg-gradient-to-r hover:border-r-4 hover:border-indigo-300" : ""
      }`}>
      <div className="flex flex-row justify-between">
        <span
          className={`w-full h-full py-2 px-4 ${
            active ? "font-bold" : ""
          }`}
          onClick={() => onOpenPage(page)}>
          {page.name}
        </span>
        <Menu
          as="div"
          className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full py-2 px-4 text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <DotsVerticalIcon
                className="w-4 h-4 text-gray-600 hover:text-indigo-600"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  <button
                    className={`text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                    <PencilIcon
                      className="w-5 h-5 mr-2"
                      aria-hidden="true"
                    />{" "}
                    Edit
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