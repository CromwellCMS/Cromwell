import { TextButton } from '@components/buttons/TextButton';
import { themeEditPageInfo } from '@constants/PageInfos';
import { TCCSVersion, TPackageCromwellConfig } from '@cromwell/core';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowUpCircleIcon,
  CursorArrowRippleIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { ArrowPathIcon, EllipsisVerticalIcon, PencilIcon } from '@heroicons/react/24/solid';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const ThemePackage = ({
  isActive,
  isInstalled,
  availableUpdate,
  isUnderUpdate,
  info,
  isChangingTheme,
  onDeleteTheme,
  onActivateTheme,
  onUpdateTheme,
}: {
  isActive?: boolean;
  isInstalled?: boolean;
  isUnderUpdate?: boolean;
  isChangingTheme?: boolean;
  availableUpdate?: TCCSVersion;
  info: TPackageCromwellConfig;
  onActivateTheme: () => Promise<any>;
  onDeleteTheme: () => Promise<any>;
  onUpdateTheme: () => Promise<any>;
  installable?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full my-2 mr-2 max-w-2xl gap-2">
      <div
        className={`bg-white shadow-md shadow-indigo-200 rounded-xl p-4 relative ${
          isActive ? 'border border-indigo-300' : ''
        }`}
      >
        <div className="flex flex-col xl:flex-row">
          <div className="h-48 w-48 mx-auto xl:mb-0 mb-3">
            <div
              style={{
                backgroundImage: `url("data:image/png;base64,${info.image}")`,
              }}
              className="relative w-full object-scale-down lg:object-cover bg-contain bg-center bg-no-repeat h-32 lg:h-48 rounded-2xl"
            >
              {availableUpdate && (
                <span className="absolute left-1 top-1 py-[2px] px-2 m-1 bg-pink-600 text-white rounded-full text-xs">
                  update available
                </span>
              )}
              {isUnderUpdate && (
                <div className="w-full h-full flex flex-row items-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-sm">
                  <ArrowPathIcon className="w-11 h-11 p-1 text-white bg-purple-500 rounded-full animate-spin mx-auto self-center" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-auto ml-3 justify-evenly py-2">
            <div className="flex flex-wrap ">
              <div className="w-full flex-none text-xs text-indigo-700 font-medium ">
                {isActive && <span className="py-[2px] px-2 m-1 bg-indigo-600 text-white rounded-full">active</span>}
                {isInstalled && (
                  <span className="py-[2px] px-2 m-1 bg-indigo-300 text-white rounded-full">installed</span>
                )}
                <span className="py-[2px] px-2 m-1 bg-gray-300 text-gray-600 rounded-full">{info.version}</span>
              </div>
              <h2 className="flex-auto text-lg font-medium">{info.title}</h2>
            </div>
            <p className="mt-3"></p>
            <div className="flex py-4 items-start justify-items-start justify-start  text-sm text-gray-500">
              <div className="flex-1 inline-flex items-center max-w-full">
                {info.description && (
                  <div
                    className="max-w-md"
                    dangerouslySetInnerHTML={{
                      __html: info.description,
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex p-4 pb-2 border-t border-gray-200 "></div>
            <div className="flex space-x-1 text-sm font-medium">
              <div className="flex-auto flex space-x-1">
                {isInstalled && isActive && (
                  <Link to={`${themeEditPageInfo.baseRoute}`} className="no-underline">
                    <TextButton>
                      <PencilIcon className="w-3 h-3 inline mr-2" />
                      Edit Theme
                    </TextButton>
                  </Link>
                )}
                {isInstalled && !isActive && (
                  <TextButton onClick={onActivateTheme} variant="outlined">
                    <CursorArrowRippleIcon className="w-4 h-4 inline mr-2" />
                    Activate Theme
                  </TextButton>
                )}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-opacity-75">
                      <EllipsisVerticalIcon className="w-5 h-5 ml-2 -mr-1 text-gray-800" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-1 py-1 ">
                        {availableUpdate && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={onUpdateTheme}
                                className={`${
                                  active ? 'bg-violet-500 text-white' : 'text-gray-900 bg-violet-100 dark:bg-violet-900'
                                } group flex rounded-md items-center animate-pulse w-full px-2 py-2 text-sm`}
                              >
                                <ArrowUpCircleIcon className="w-4 h-4 inline mr-2" />
                                Update Theme
                              </button>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                              <InformationCircleIcon className="w-4 h-4 inline mr-2" />
                              Theme Info
                            </button>
                          )}
                        </Menu.Item>
                        {!isActive && (
                          <>
                            <hr className="my-2" />
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  disabled={isUnderUpdate || isChangingTheme}
                                  onClick={onDeleteTheme}
                                  className={`${
                                    active ? 'bg-red-500 text-white' : 'text-red-600'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                >
                                  <TrashIcon className="w-4 h-4 inline mr-2" />
                                  Delete Theme
                                </button>
                              )}
                            </Menu.Item>
                          </>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ThemePackageSkeleton = () => {
  return (
    <div className="flex flex-col w-screen my-2 mr-2 max-w-2xl gap-2">
      <div className={`bg-white shadow-md shadow-indigo-200 rounded-xl p-4 relative`}>
        <div className="flex flex-col xl:flex-row">
          <div className="h-48 w-48 mx-auto xl:mb-0 mb-3">
            <div className="relative w-full object-scale-down lg:object-cover bg-contain bg-center bg-no-repeat h-32 lg:h-48 rounded-2xl bg-gray-200 animate-pulse"></div>
          </div>
          <div className="flex-auto ml-3 justify-evenly py-2">
            <div className="flex flex-wrap ">
              <div className="w-full flex-none text-xs text-indigo-700 font-medium ">
                <span className="py-[2px] px-2 m-1 bg-gray-200 text-gray-600 rounded-full h-5 animate-pulse"></span>
                <span className="py-[2px] px-2 m-1 bg-gray-200 text-gray-600 rounded-full h-5 animate-pulse"></span>
                <span className="py-[2px] px-2 m-1 bg-gray-200 text-gray-600 rounded-full h-5 animate-pulse"></span>
              </div>
              <h2 className="flex-auto text-lg font-medium bg-gray-200 animate-pulse w-full h-8 rounded-xl mt-2"></h2>
            </div>
            <p className="mt-3"></p>
            <div className="flex py-4 items-start justify-items-start justify-start  text-sm text-gray-500">
              <div className="flex-1 inline-flex items-center max-w-full w-full bg-gray-200 animate-pulse h-20 rounded-xl"></div>
            </div>
            <div className="flex p-4 pb-2 border-t border-gray-200 "></div>
            <div className="flex space-x-1 text-sm font-medium">
              <div className="flex-auto flex space-x-1 bg-gray-200 animate-pulse rounded-xl h-4 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
