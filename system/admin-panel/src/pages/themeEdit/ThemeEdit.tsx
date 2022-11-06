import { getStoreItem, TCromwellBlockData, TPageConfig, TPageInfo, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { PageBuilderProvider } from './hooks/usePageBuilder';
import { ThemeEditorProvider, useThemeEditor } from './hooks/useThemeEditor';
import { PageFrame } from './pageEditor/PageEditor';
import { PageActions } from './pageEditorSidebar/components/PageActions';
import { PageEditorSidebar } from './pageEditorSidebar/PageEditorSidebar';
import { PageList } from './pageList/PageList';
import './ThemeEdit.module.scss';

export type TExtendedPageInfo = TPageInfo & {
  isSaved?: boolean;
  previewUrl?: string;
};

export type TExtendedPageConfig = TPageConfig & TExtendedPageInfo;

export const InnerThemeEditor: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const { minimizeLeftbar, setMinimizeLeftbar, isPageLoading, frameWidth } = useThemeEditor();

  return (
    <div className={`w-full h-full relative`}>
      <div className="bg-gray-900 h-10 w-full p-2 top-0 z-10 fixed">
        <div className="flex flex-row h-full w-full justify-between">
          <Link to="/" className="w-8">
            <img
              src="/admin/static/logo_small_black.svg"
              width="15px"
              className="m-2 my-1 w-5 self-center justify-self-start invert"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-row builder select-none">
        <div
          className={`bg-white transform transition-all ${
            minimizeLeftbar
              ? 'absolute left-0 top-14 w-56 h-9 overflow-hidden shadow-lg rounded-r-lg z-[500]'
              : 'w-72 h-screen pt-10 border-r border-gray-300'
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
          <div className="flex flex-col h-screen w-full pt-10 relative">
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

export const ThemeEditor: React.FunctionComponent<RouteComponentProps> = (props) => {
  return (
    <ThemeEditorProvider>
      <InnerThemeEditor {...props} />
    </ThemeEditorProvider>
  );
};

export default ThemeEditor;
