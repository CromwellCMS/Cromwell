import { getRandStr, sleep } from '@cromwell/core';
import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { usePageBuilder } from '../hooks/usePageBuilder';
import { useThemeEditor } from '../hooks/useThemeEditor';
import { TExtendedPageInfo } from '../ThemeEdit';
import { PageItem } from './PageItem';

export const PageList = () => {
  const { pageInfos, handleOpenPage, editingPageConfig, setPageInfos, setChangedPageInfo, hasUnsavedModifications } =
    useThemeEditor();
  // const [pageCount, setPageCount] = useState(pageInfos.length)
  const [pageAdded, setPageAdded] = useState(false);
  const info = pageInfos?.map((p) => {
    if (p.id === editingPageConfig?.id) {
      return Object.assign({}, p, editingPageConfig);
    }
    return p;
  });
  const defaultPages = pageInfos?.filter((p) => !p.isVirtual);
  const customPages = pageInfos?.filter((p) => p.isVirtual);

  useEffect(() => {
    const openNewPage = async () => {
      await handleOpenPage(pageInfos[pageInfos.length - 1]);
      setChangedPageInfo(true);
    };
    if (pageAdded) {
      openNewPage();
      setPageAdded(false);
    }
    // if (pageInfos.length !== pageCount) {
    //   setPageCount(pageInfos.length);
    // }
  }, [pageAdded]);

  const handleAddCustomPage = async () => {
    const newPage = {
      id: `generic_${getRandStr(8)}`,
      route: `pages/new-${getRandStr(4)}`,
      name: 'New page',
      isVirtual: true,
      isSaved: false,
    };
    setPageInfos((prev) => [...prev, newPage]);
    setPageAdded(true);
    // await handleOpenPage(newPage);
    // setChangedPageInfo(true);
  };

  return (
    <div>
      <hr />
      <h3 className="font-bold text-xs py-2 px-4 text-gray-700">Theme Pages</h3>
      <ul>
        {defaultPages.map((page) => (
          <PageItem key={page.id} page={page} onOpenPage={handleOpenPage} />
        ))}
      </ul>
      <hr className="my-4" />
      <div className="relative">
        <h3 className="font-bold text-xs py-2 px-4 text-gray-700">Custom Pages</h3>
        <button
          onClick={handleAddCustomPage}
          className="rounded-xl bg-gray-200 p-1 px-2 top-1 right-2 text-indigo-700 group absolute hover:bg-indigo-500 hover:text-white"
        >
          <PlusIcon className="h-3 w-3 inline-block" />
          <span className="font-bold mx-2 text-xs group:hover:text-white inline-block group:text-gray-400">new</span>
        </button>
      </div>
      <ul>
        {customPages.map((page) => (
          <PageItem key={page.id} page={page} onOpenPage={handleOpenPage} />
        ))}
      </ul>
    </div>
  );
};
