import './ThemeEdit.module.scss';

import { SwipeableSideNav } from '@components/sideNav/ResponsiveSideNav';
import { TPageConfig, TPageInfo } from '@cromwell/core';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { PageBuilderProvider } from './hooks/usePageBuilder';
import { ThemeEditorProvider, useThemeEditor } from './hooks/useThemeEditor';
import { PageFrame } from './pageEditor/PageEditor';
import { PageActions } from './pageEditorSidebar/components/PageActions';
import { PageEditorSidebar } from './pageEditorSidebar/PageEditorSidebar';
import { PageList } from './pageList/PageList';

export type TExtendedPageInfo = TPageInfo & {
  isSaved?: boolean;
  previewUrl?: string;
};

export type TExtendedPageConfig = TPageConfig & TExtendedPageInfo;

export const InnerThemeEditor: React.FC = () => {
  const { minimizeLeftbar, setMinimizeLeftbar, isPageLoading, frameWidth } = useThemeEditor();

  return (
    <div className={`w-full h-full relative`}>
      <SwipeableSideNav />
      <div className="flex flex-row builder select-none">
        <div
          className={`bg-white transform transition-all ${
            minimizeLeftbar
              ? 'absolute left-0 top-14 w-56 h-9 overflow-hidden shadow-lg rounded-r-lg z-[500]'
              : 'w-72 h-screen border-r border-gray-300'
          }`}
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-xs py-2 px-4 text-gray-700">Pages</h2>
            <ChevronLeftIcon
              onClick={() => setMinimizeLeftbar((o) => !o)}
              className={`w-7 h-7 cursor-pointer hover:bg-gray-300 rounded-lg p-2 m-1 ${
                minimizeLeftbar ? 'rotate-180' : ''
              }`}
            />
          </div>
          {!minimizeLeftbar && <PageList />}
        </div>
        <PageBuilderProvider>
          <div className="flex flex-col h-screen w-full relative">
            <PageActions />
            <div
              className={`w-full ${
                frameWidth > 1
                  ? frameWidth === 4
                    ? 'max-w-full'
                    : 'w-[765px] h-[800px] mt-20 p-6 bg-black rounded-xl pb-14'
                  : 'w-[384px] h-[700px] mt-20 p-6 bg-black rounded-xl pb-14'
              } transform transition-all relative h-full mx-auto overflow-y-auto`}
            >
              {!isPageLoading && <PageFrame />}
            </div>
          </div>
          <PageEditorSidebar />
        </PageBuilderProvider>
      </div>
    </div>
  );
};

export const ThemeEditor: React.FC = () => {
  return (
    <ThemeEditorProvider>
      <InnerThemeEditor />
    </ThemeEditorProvider>
  );
};

export default ThemeEditor;
