import { SideNavToggleButton } from '@components/sideNav/ResponsiveSideNav';
import { TPageConfig } from '@cromwell/core';
import { Listbox, Transition } from '@headlessui/react';
import {
  ArrowUturnLeftIcon,
  CheckIcon,
  ChevronUpDownIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
} from '@heroicons/react/24/outline';
import { ComputerDesktopIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';

export const PageActions = () => {
  const { undoModification, redoModification, hasUnsavedModifications, history, undoneHistory, savePage } =
    usePageBuilder();
  const { editingPageConfig, themeConfig, overrideConfig, setChangedPageInfo, setEditingPageConfig } = useThemeEditor();
  const config = editingPageConfig;
  const [, forceUpdate] = useState(0);
  const [previewUrl, setPreviewUrl] = useState((config?.previewUrl ?? config?.route) || '');
  const genericPages = themeConfig?.genericPages ?? [{ route: 'pages/[slug]', name: 'default' }];
  const currentLayout = config?.layoutRoute
    ? genericPages.find((p) => p.route === config.layoutRoute)
    : genericPages[0];
  const pageLayout = useRef(currentLayout);

  useEffect(() => {
    setPreviewUrl((editingPageConfig?.previewUrl ?? editingPageConfig?.route) || '');
  }, [editingPageConfig]);

  const handleChangeUrl = (val: string) => {
    const rootUrl = config.route.replace('[slug]', '').replace('[id]', '');
    if (!val) val = '';
    val = val.replace(rootUrl, '');
    val = val.replace(/\W/g, '-');
    val = rootUrl + val;
    setPreviewUrl(val);
  };

  const onURLBlur = () => {
    handleChangeUrl(previewUrl);
    if (previewUrl !== config?.previewUrl) {
      setEditingPageConfig((prev) => ({
        ...prev,
        previewUrl,
      }));
    }
  };

  const handleChange = (prop: keyof TPageConfig, val: any) => {
    if (config?.isVirtual && prop === 'route') {
      if (!val) val = '';
      const prefix = pageLayout.current.route.replace('[slug]', '');
      val = val.replace(prefix, '');
      val = val.replace(/\W/g, '-');
      val = prefix + val;
    }
    overrideConfig((prev) => {
      return {
        ...prev,
        [prop]: val,
        layoutRoute: pageLayout.current.route,
      };
    });
    setChangedPageInfo(true);
    forceUpdate((o) => o + 1);
  };

  const changeLayout = ({ route, name }: { route?: string; name?: string }) => {
    pageLayout.current = { route, name };
    handleChange('route', config.route);
  };

  if (!editingPageConfig) {
    return (
      <div className="bg-black flex flex-row h-12 w-full p-2 py-3 justify-between">
        <div className="top-[7px] absolute">
          <SideNavToggleButton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black flex flex-row h-12 w-full p-2 py-3 justify-between">
      <div className="flex">
        <div className="top-[-4px] w-[36px] relative">
          <SideNavToggleButton />
        </div>
        <div className="h-9 justify-self-end">
          <DeviceSwitcher />
        </div>
      </div>
      <div className="">
        {editingPageConfig && (
          <label className="inline-block">
            <span className="text-xs px-1 text-gray-500">Preview URL</span>
            <input
              disabled={!config?.previewUrl}
              className="rounded-sm font-bold bg-gray-700 text-xs py-1 px-2 text-gray-300 inline-block disabled:bg-transparent disabled:cursor-not-allowed"
              value={previewUrl}
              onChange={(e) => handleChangeUrl(e.target.value)}
              onBlur={onURLBlur}
            />
          </label>
        )}

        {editingPageConfig.isVirtual && !!genericPages?.length && genericPages.length > 1 && (
          <Listbox value={pageLayout.current} onChange={changeLayout}>
            <div className="ml-2 relative inline-block">
              <Listbox.Button className="rounded-sm cursor-default bg-indigo-800 shadow-md text-left w-full py-1 pr-10 pl-3 relative sm:text-xs focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-indigo-300 focus-visible:ring-offset-2">
                <span className="text-gray-300 block truncate">
                  <span className="text-gray-400">Layout:</span> {pageLayout.current.name}
                </span>
                <span className="flex pr-2 inset-y-0 right-0 absolute items-center pointer-events-none">
                  {genericPages.length > 1 && (
                    <ChevronUpDownIcon className="h-5 text-gray-400 w-5" aria-hidden="true" />
                  )}
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="bg-white rounded-md shadow-lg ring-black mt-1 text-base w-full max-h-60 py-1 ring-1 ring-opacity-5 z-[80] absolute overflow-auto sm:text-xs focus:outline-none">
                  {genericPages.map((page, pIdx) => (
                    <Listbox.Option
                      key={pIdx}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                          active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'
                        }`
                      }
                      value={page.route}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {page.name}
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
        )}
      </div>
      <div className="flex flex-row text-white gap-4">
        <button
          disabled={history.length === 0}
          className={`${history.length > 0 ? 'text-white' : 'text-gray-600'} disabled:cursor-default`}
        >
          <ArrowUturnLeftIcon onClick={undoModification} className="h-5 w-5" />
        </button>
        <button
          disabled={undoneHistory.length === 0}
          className={`${undoneHistory.length > 0 ? 'text-white' : 'text-gray-600'} disabled:cursor-default`}
        >
          <ArrowUturnLeftIcon onClick={redoModification} className="h-5 w-5 -scale-x-100" />
        </button>
        <button
          onClick={savePage}
          disabled={!hasUnsavedModifications}
          className="rounded-md font-bold bg-purple-600 text-xs text-white py-1 px-2 w-16 uppercase hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          save
        </button>
      </div>
    </div>
  );
};

const DeviceSwitcher = () => {
  const { frameWidth, setFrameWidth } = useThemeEditor();
  return (
    <>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${frameWidth <= 1 ? 'text-white' : 'text-gray-500'}`}
        onClick={() => setFrameWidth(0)}
      >
        <DevicePhoneMobileIcon className="h-5 w-5 inline-block" />
      </span>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${
          frameWidth > 1 && frameWidth < 4 ? 'text-white' : 'text-gray-500'
        }`}
        onClick={() => setFrameWidth(2)}
      >
        <DeviceTabletIcon className="h-6 w-6 inline-block" />
      </span>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${frameWidth === 4 ? 'text-white' : 'text-gray-500'}`}
        onClick={() => setFrameWidth(4)}
      >
        <ComputerDesktopIcon className="h-6 w-6 inline-block" />
      </span>
    </>
  );
};
