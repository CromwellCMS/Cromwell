import { TCromwellBlockType } from '@cromwell/core';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, PlusIcon } from '@heroicons/react/outline';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';
import { BlockIcon } from './BlockMenu';

const defaultOptions = [
  {
    type: 'text',
    title: 'Simple Text',
  },
  {
    type: 'editor',
    title: 'Text Editor',
  },
  {
    type: 'container',
    title: 'Container',
  },
  {
    type: 'HTML',
    title: 'Custom HTML',
  },
  {
    type: 'image',
    title: 'Image',
  },
  {
    type: 'gallery',
    title: 'Gallery',
  },
];

export const NewBlockMenu = ({
  onAddBlock = () => {},
  position = 'bottom',
}: {
  onAddBlock?: any;
  position?: 'top' | 'bottom';
}) => {
  const { plugins, pageFrameRef } = useThemeEditor();
  // const {  } = usePageBuilder();
  const [searchValue, setSearchValue] = useState('');
  const element = useRef<HTMLDivElement>();
  const [showBottom, setBottom] = useState(true);
  const [showBottomInverse, setBottomInverse] = useState(true);

  const debouncedSearch = useDebounce(searchValue, 100);
  const allPlugins = [
    ...defaultOptions,
    ...(plugins as any[]).map((p) => {
      p.type = 'plugin';
      p.plugin = {
        pluginName: p.name,
      };
      return p;
    }),
  ];

  useEffect(() => {
    const dimensions = element.current?.getBoundingClientRect();
    const frameDimensions = pageFrameRef.current?.getBoundingClientRect();

    const isBottom = dimensions && frameDimensions.bottom - dimensions.bottom > 200;
    const isBottomInverse = dimensions && dimensions.top < 300;

    setBottomInverse(isBottomInverse);
    setBottom(isBottom);
  }, [element.current]);

  // console.log(frameDimensions, dimensions)

  return (
    <div
      ref={element}
      className={`transform ${position === 'bottom' ? '-bottom-7' : '-top-8'} left-1/2 -translate-x-1/2 absolute`}
    >
      <Listbox
        value={null}
        onChange={(newBlock) => {
          onAddBlock(newBlock, position);
        }}
      >
        <div className="mt-1 relative">
          <Listbox.Button
            className={`border ${
              position === 'bottom' ? 'rounded-b-lg' : 'rounded-t-lg'
            } font-bold bg-indigo-600 border-indigo-800 h-7 shadow-lg text-center text-white p-1 shadow-indigo-400 w-14 pointer-events-auto uppercase hover:bg-indigo-500`}
          >
            <PlusIcon className="mx-auto h-5 w-5 inline" />
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              className={`${showBottom && position === 'bottom' ? '' : 'top-[-240px]'} ${
                showBottomInverse && position === 'top' ? 'top-8' : 'top-[-240px]'
              } bg-white rounded-md shadow-md ring-black mt-1 text-base max-h-60 transform pb-1 shadow-indigo-400 ring-1 ring-opacity-5 w-72 z-[100] -translate-x-1/2 left-1/2 scrollbar-slim absolute overflow-auto pointer-events-auto sm:text-sm focus:outline-none`}
            >
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value || '')}
                className="border mx-auto border-gray-100 shadow-sm mb-2 w-full py-1 px-2 top-0 z-[20] sticky"
                placeholder="Search..."
              />
              {allPlugins
                .filter((k) => {
                  if (debouncedSearch === '' || !debouncedSearch) return true;
                  return k.title.toLowerCase().includes(debouncedSearch.toLowerCase());
                })
                .map((plugin, pluginIdx) => (
                  <Listbox.Option
                    key={pluginIdx}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'
                      }`
                    }
                    value={plugin}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {plugin.title}
                        </span>
                        {selected ? (
                          <span className="flex pl-2 inset-y-0 left-0 text-indigo-600 absolute items-center">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {
                          <span className="flex pl-2 inset-y-0 left-0 text-indigo-600 absolute items-center">
                            <BlockIcon bType={plugin.type} />
                          </span>
                        }
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
