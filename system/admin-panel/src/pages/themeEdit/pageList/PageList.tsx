import React from "react";
import { useThemeEditor } from "../hooks/useThemeEditor";
import { PageItem } from "./PageItem"

export const PageList = () => {
  const { pageInfos, handleOpenPage, editingPageConfig } =
    useThemeEditor();
  const info = pageInfos?.map((p) => {
    if (p.id === editingPageConfig?.id) {
      return Object.assign({}, p, editingPageConfig);
    }
    return p;
  });
  const defaultPages = pageInfos?.filter(
    (p) => !p.isVirtual,
  );
  const customPages = pageInfos?.filter((p) => p.isVirtual);

  return (
    <div>
      <hr />
      <h3 className="font-bold text-xs text-gray-700 py-2 px-4">
        Theme Pages
      </h3>
      <ul>
        {defaultPages.map((page) => (
          <PageItem
            key={page.id}
            page={page}
            onOpenPage={handleOpenPage}
          />
        ))}
      </ul>
      <hr className="my-4" />
      <h3 className="font-bold text-xs text-gray-700 py-2 px-4">
        Custom Pages
      </h3>
      <ul>
        {customPages.map((page) => (
          <PageItem
            key={page.id}
            page={page}
            onOpenPage={handleOpenPage}
          />
        ))}
      </ul>
    </div>
  );
};